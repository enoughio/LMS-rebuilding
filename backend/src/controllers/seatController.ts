import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { BookingStatus, PaymentType, PaymentMedium, PaymentStatus } from '../../generated/prisma/index.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Get all seats in a library
export const getLibrarySeats = async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;

    if (!libraryId) {
      res.status(400).json({ success: false, error: 'Library ID is required' });
      return;
    }

    // Check if the library exists
    const library = await prisma.library.findUnique({
      where: { id: libraryId },
      select: {
        id: true,
        name: true,
        address: true,
        description: true,
        email: true,
        phone: true, 
      }
    });

    const seats = await prisma.seat.findMany({
      where: {
        libraryId,
      },
      include: {
        seatType: true, // Include seat type details
        bookings: true
      },
    });

    // const seattype = await prisma.seatType.findMany({
    //   where: {
    //     libraryId,
    //   },
    // });


    res.json({ success: true, data: { library, seats } });
    // res.json({ success: true, data: {   seats, seattype } });
  } catch (error) {
    console.error('Error fetching library seats:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Get seat availability for a specific date
export const getSeatAvailability = async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;
    const { date, seatTypeId } = req.query;

    if (!date || typeof date !== 'string') {
      res.status(400).json({ 
        success: false, 
        message: 'Date is required',
        error: 'Date parameter is missing or invalid' 
      });
      return;
    }

    // Validate date format
    const queryDate = new Date(date);
    if (isNaN(queryDate.getTime())) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid date format',
        error: 'Please provide a valid date in ISO format' 
      });
      return;
    }

    // Check if library exists
    const library = await prisma.library.findUnique({
      where: { id: libraryId },
      select: { id: true, name: true }
    });

    if (!library) {
      res.status(404).json({
        success: false,
        message: 'Library not found',
        error: 'The specified library does not exist'
      });
      return;
    }

    // Build where clause for seats
    const whereClause: any = {
      libraryId,
      isActive: true,
    };

    // If seatTypeId is provided, filter by seat type
    if (seatTypeId && typeof seatTypeId === 'string') {
      whereClause.seatTypeId = seatTypeId;
    }

    const seats = await prisma.seat.findMany({
      where: whereClause,
      include: {
        seatType: {
          select: {
            id: true,
            name: true,
            pricePerHour: true,
            description: true,
            color: true,
            amenities: true,
          }
        },
        bookings: {
          where: {
            date: {
              gte: new Date(queryDate.toDateString()), // Start of day
              lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000), // End of day
            },
            status: {
              in: ['CONFIRMED', 'PENDING'] // Consider both confirmed and pending bookings
            }
          },
          select: {
            id: true,
            startTime: true,
            endTime: true,
            status: true,
          }
        },
      },
      orderBy: [
        { seatType: { name: 'asc' } },
        { name: 'asc' }
      ]
    });

    // Transform the data to show availability with booking details
    const availability = seats.map(seat => {
      const bookedSlots = seat.bookings.map(booking => ({
        bookingId: booking.id,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
      }));

      // Check if seat is available (no active bookings for the day)
      const isAvailableForDay = seat.isAvailable && bookedSlots.length === 0;

      return {
        seatId: seat.id,
        name: seat.name,
        seatType: seat.seatType,
        isAvailable: isAvailableForDay,
        isActive: seat.isActive,
        bookedSlots,
        totalBookings: bookedSlots.length,
      };
    });

    // Group by seat type for better organization
    const groupedByType = availability.reduce((acc, seat) => {
      const typeName = seat.seatType.name;
      if (!acc[typeName]) {
        acc[typeName] = {
          seatType: seat.seatType,
          seats: [],
          availableCount: 0,
          totalCount: 0,
        };
      }
      acc[typeName].seats.push(seat);
      acc[typeName].totalCount++;
      if (seat.isAvailable) {
        acc[typeName].availableCount++;
      }
      return acc;
    }, {} as any);

    res.json({ 
      success: true, 
      data: {
        library,
        date: queryDate.toISOString().split('T')[0],
        seatTypeFilter: seatTypeId || null,
        availability,
        groupedByType,
        summary: {
          totalSeats: availability.length,
          availableSeats: availability.filter(s => s.isAvailable).length,
          bookedSeats: availability.filter(s => !s.isAvailable).length,
        }
      }
    });
  } catch (error) {
    console.error('Error fetching seat availability:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch seat availability',
      error: 'Internal server error' 
    });
  }
};



// // Create a new seat
export const createSeat = async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;
    const { name, seatTypeId } = req.body; 

    const seat = await prisma.seat.create({
      data: {
        name,
        seatType : {
          connect: { id: seatTypeId },
        },
        library: {
          connect: { id: libraryId },
        },
      },
    });

    res.status(201).json({ success: true, data: seat });
  } catch (error) {
    console.error('Error creating seat:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Update seat details
export const updateSeat = async (req: Request, res: Response) => {
  try {
    const { seatId } = req.params;
    // const updateData = req.body;
    const { name, seatTypeId } = req.body;
    const updateData: any = {};

    if (name) {
      updateData.name = name;
    }

    if (seatTypeId) {
      updateData.seatType = {
        connect: { id: seatTypeId },
      };
    }

    const seat = await prisma.seat.update({
      where: { id: seatId },
      data: updateData,
    });

    res.json({ success: true, data: seat });
  } catch (error) {
    console.error('Error updating seat:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Delete a seat
export const deleteSeat = async (req: Request, res: Response) => {
  try {
    const { seatId } = req.params;

    if (!seatId) {
      res.status(400).json({ success: false, error: 'Seat ID is required' });
      return;
    }

    // Check if the seat exists
    const seat = await prisma.seat.findUnique({
      where: { id: seatId },
    });
    if (!seat) {
      res.status(404).json({ success: false, error: 'Seat not found' });
      return;
    }

    //Delete the seat
    await prisma.seat.delete({
      where: { id: seatId },
    });

    res.json({ success: true, message: 'Seat deleted successfully' });
  } catch (error) {
    console.error('Error deleting seat:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};


// Book a seat
export const bookSeat = async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;
    const { 
      seatId, 
      date, 
      startTime, 
      endTime, 
      duration,
      paymentMethod = 'OFFLINE',
      guestBooking // For guest bookings
    } = req.body;

    // Check if this is a guest booking route
    const isGuestBooking = req.path.includes('/book-guest');
    
    // Get user ID from authenticated request (only for regular bookings)
    const userId = (req as any).user?.id;
    
    // Validate authentication based on booking type
    if (!isGuestBooking && !userId) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }
    
    if (isGuestBooking && !guestBooking) {
      res.status(400).json({ success: false, error: 'Guest booking information required' });
      return;
    }

    // Validate required fields
    if (!seatId || !date || !startTime || !endTime || !duration) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: seatId, date, startTime, endTime, duration' 
      });
      return;
    }

    // Parse and validate date
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      res.status(400).json({ success: false, error: 'Invalid date format' });
      return;
    }

    // Check if the booking date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      res.status(400).json({ success: false, error: 'Cannot book seats for past dates' });
      return;
    }

    // Get seat details with library and seat type info
    const seat = await prisma.seat.findUnique({
      where: { id: seatId },
      include: {
        seatType: true,
        library: {
          select: {
            id: true,
            name: true,
            address: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!seat) {
      res.status(404).json({ success: false, error: 'Seat not found' });
      return;
    }

    if (!seat.isAvailable || !seat.isActive) {
      res.status(400).json({ success: false, error: 'Seat is not available for booking' });
      return;
    }

    if (seat.libraryId !== libraryId) {
      res.status(400).json({ success: false, error: 'Seat does not belong to the specified library' });
      return;
    }

    // Check for existing bookings on the same date and time slot
    const conflictingBookings = await prisma.seatBooking.findFirst({
      where: {
        seatId,
        date: {
          gte: new Date(bookingDate.toDateString()),
          lt: new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000)
        },
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.PENDING]
        },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } }
            ]
          }
        ]
      }
    });

    if (conflictingBookings) {
      res.status(400).json({ 
        success: false, 
        error: 'Seat is already booked for the selected time slot' 
      });
      return;
    }    // Calculate booking price
    const bookingPrice = seat.seatType.pricePerHour * duration;    // Get user details for the booking or use guest info
    let user;
    if (!isGuestBooking && userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      });

      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }
    } else if (isGuestBooking) {
      // Use guest booking info
      user = {
        id: null,
        name: guestBooking.name,
        email: guestBooking.email,
        phone: guestBooking.phone
      };
    }// Create booking and payment in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the seat booking
      const bookingData: any = {
        date: bookingDate,
        seatName: seat.name,
        startTime,
        endTime,
        bookingPrice,
        status: BookingStatus.CONFIRMED, // Auto-confirm for now
        isGuest: !userId, // Set guest flag
        seat: { connect: { id: seatId } },
        library: { connect: { id: libraryId } }
      };      // Connect user if authenticated, otherwise create guest booking
      if (!isGuestBooking && userId) {
        bookingData.user = { connect: { id: userId } };
      } else if (isGuestBooking) {
        // Create a guest record if needed
        const guest = await tx.guestUser.create({
          data: {
            name: guestBooking.name,
            email: guestBooking.email,
            phone: guestBooking.phone
          }
        });
        bookingData.guestUser = { connect: { id: guest.id } };
      }const booking = await tx.seatBooking.create({
        data: bookingData,
        include: {
          seat: {
            include: {
              seatType: true,
              library: {
                select: {
                  id: true,
                  name: true,
                  address: true,
                  email: true,
                  phone: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          guestUser: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      });      // Create payment record
      const paymentData: any = {
        amount: bookingPrice,
        type: !isGuestBooking ? PaymentType.SEAT_BOOKING : PaymentType.GUEST_SEAT_BOOKING,
        status: PaymentStatus.COMPLETED, // Auto-complete for offline payments
        medium: paymentMethod === 'OFFLINE' ? PaymentMedium.OFFLINE : PaymentMedium.ONLINE,
        paymentMethod,
        notes: `Seat booking payment for ${seat.name} on ${bookingDate.toDateString()}`,
        seatBooking: { connect: { id: booking.id } }
      };

      if (!isGuestBooking && userId) {
        paymentData.user = { connect: { id: userId } };
      } else if (isGuestBooking) {
        paymentData.guestUser = { connect: { id: booking.guestUser!.id } };
      }

      const payment = await tx.payment.create({
        data: paymentData
      });

      return { booking, payment };    });    // Generate PDF bill (optional - for future download)
    // const billPath = await generateBookingBill(result.booking, result.payment);

    // TODO: Send confirmation email to user
    // await sendBookingConfirmationEmail(user.email, result.booking, billPath);

    res.status(201).json({
      success: true,
      message: 'Seat booked successfully',
      data: {
        booking: result.booking,
        payment: result.payment,
        billUrl: `/api/seats/download-bill/${result.booking.id}`
      }
    });

  } catch (error) {
    console.error('Error booking seat:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};



// Generate PDF bill for booking
const generateBookingBill = async (booking: any, payment: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create bills directory if it doesn't exist
      const billsDir = path.join(process.cwd(), 'bills');
      if (!fs.existsSync(billsDir)) {
        fs.mkdirSync(billsDir, { recursive: true });
      }

      const fileName = `bill_${booking.id}_${Date.now()}.pdf`;
      const filePath = path.join(billsDir, fileName);

      // Create PDF document
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('SEAT BOOKING BILL', { align: 'center' });
      doc.moveDown();

      // Library Info
      doc.fontSize(16).text('Library Details:', { underline: true });
      doc.fontSize(12)
        .text(`Name: ${booking.seat.library.name}`)
        .text(`Address: ${booking.seat.library.address}`)
        .text(`Email: ${booking.seat.library.email}`)
        .text(`Phone: ${booking.seat.library.phone}`);
      doc.moveDown();

      // Customer Info
      doc.fontSize(16).text('Customer Details:', { underline: true });
      doc.fontSize(12)
        .text(`Name: ${booking.user.name}`)
        .text(`Email: ${booking.user.email}`)
        .text(`Phone: ${booking.user.phone || 'N/A'}`);
      doc.moveDown();

      // Booking Details
      doc.fontSize(16).text('Booking Details:', { underline: true });
      doc.fontSize(12)
        .text(`Booking ID: ${booking.id}`)
        .text(`Seat: ${booking.seatName}`)
        .text(`Seat Type: ${booking.seat.seatType.name}`)
        .text(`Date: ${new Date(booking.date).toDateString()}`)
        .text(`Time: ${booking.startTime} - ${booking.endTime}`)
        .text(`Status: ${booking.status}`);
      doc.moveDown();

      // Payment Details
      doc.fontSize(16).text('Payment Details:', { underline: true });
      doc.fontSize(12)
        .text(`Payment ID: ${payment.id}`)
        .text(`Amount: ${payment.currency} ${payment.amount}`)
        .text(`Payment Method: ${payment.paymentMethod}`)
        .text(`Payment Status: ${payment.status}`)
        .text(`Transaction Date: ${new Date(payment.createdAt).toLocaleString()}`);
      doc.moveDown();

      // Footer
      doc.fontSize(10).text('Thank you for choosing our library!', { align: 'center' });
      doc.text('This is a computer-generated bill.', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

      stream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};

// Download bill endpoint
export const downloadBill = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    // Get booking with all necessary details
    const booking = await prisma.seatBooking.findFirst({
      where: {
        id: bookingId,
        userId: userId // Ensure user can only download their own bills
      },
      include: {
        seat: {
          include: {
            seatType: true,
            library: {
              select: {
                id: true,
                name: true,
                address: true,
                email: true,
                phone: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        payment: true
      }
    });

    if (!booking) {
      res.status(404).json({ success: false, error: 'Booking not found' });
      return;
    }

    if (!booking.payment) {
      res.status(404).json({ success: false, error: 'Payment record not found' });
      return;
    }

    // Generate PDF bill
    const billPath = await generateBookingBill(booking, booking.payment);

    // Send file for download
    res.download(billPath, `booking_bill_${booking.id}.pdf`, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ success: false, error: 'Error downloading bill' });
      }
    });

  } catch (error) {
    console.error('Error downloading bill:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Get user's bookings
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const bookings = await prisma.seatBooking.findMany({
      where: {
        userId,
      },
      include: {
        seat: {
          include: {
            seatType: true,
            library: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            paymentMethod: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Cancel booking
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    // Check if booking exists and belongs to user
    const existingBooking = await prisma.seatBooking.findFirst({
      where: {
        id: bookingId,
        userId: userId
      }
    });

    if (!existingBooking) {
      res.status(404).json({ success: false, error: 'Booking not found' });
      return;
    }

    if (existingBooking.status === BookingStatus.CANCELLED) {
      res.status(400).json({ success: false, error: 'Booking is already cancelled' });
      return;
    }

    if (existingBooking.status === BookingStatus.COMPLETED) {
      res.status(400).json({ success: false, error: 'Cannot cancel completed booking' });
      return;
    }

    // Update booking status
    const booking = await prisma.seatBooking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: BookingStatus.CANCELLED,
      },
      include: {
        seat: {
          include: {
            seatType: true,
            library: {
              select: {
                name: true,
                address: true
              }
            }
          }
        }
      }
    });

    // TODO: Process refund if applicable
    // TODO: Send cancellation email

    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully',
      data: booking 
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};




