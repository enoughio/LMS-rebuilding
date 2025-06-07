import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
// import { BookingStatus, PaymentType, PaymentMedium, PaymentStatus } from '../../generated/prisma/index.js';

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


// // Book a seat
// export const bookSeat = async (req: Request, res: Response) => {
//   try {
//     const userId = (req as any).user.id;
//     const { seatId, date, startTime, endTime, paymentMedium, paymentMethod } = req.body;

//     // Check if user has an active membership
//     const userMembership = await prisma.membership.findFirst({
//       where: {
//         userId,
//         status: 'ACTIVE',
//         endDate: {
//           gte: new Date(),
//         },
//       },
//     });

//     if (!userMembership) {
//       res.status(403).json({
//         success: false,
//         error: 'Active membership required for booking',
//       });
//       return
//     }

//     // Get seat details and pricing
//     const seatDetails = await prisma.seat.findUnique({
//       where: { id: seatId },
//       include: {
//         library: {
//           include: {
//             seatPrices: true,
//           },
//         },
//       },
//     });

//     if (!seatDetails) {
//        res.status(404).json({
//         success: false,
//         error: 'Seat not found',
//       });
//       return
//     }

//     // Calculate duration and price
//     const [startHour, startMinute] = startTime.split(':').map(Number);
//     const [endHour, endMinute] = endTime.split(':').map(Number);
//     const duration = (endHour - startHour) + (endMinute - startMinute) / 60;

//     const seatPrice = seatDetails.library.seatPrices.find(
//       price => price.seatType === seatDetails.seatType
//     );
//     const bookingPrice = seatPrice ? (seatPrice.isHourly ? seatPrice.price * duration : seatPrice.price) : 0;

//     // Check if the seat is available for the requested time
//     const existingBooking = await prisma.seatBooking.findFirst({
//       where: {
//         seatId,
//         date: new Date(date),
//         status: BookingStatus.CONFIRMED,
//         OR: [
//           {
//             AND: [
//               { startTime: { lte: startTime } },
//               { endTime: { gt: startTime } },
//             ],
//           },
//           {
//             AND: [
//               { startTime: { lt: endTime } },
//               { endTime: { gte: endTime } },
//             ],
//           },
//         ],
//       },
//     });

//     if (existingBooking) {
//       res.status(400).json({
//         success: false,
//         error: 'Seat is not available for the requested time slot',
//       });
//       return;
//     }

//     // Create the booking
//     const booking = await prisma.seatBooking.create({
//       data: {
//         date: new Date(date),
//         startTime,
//         endTime,
//         duration,
//         bookingPrice,
//         status: BookingStatus.CONFIRMED,
//         user: { connect: { id: userId } },
//         seat: { connect: { id: seatId } },
//         library: { connect: { id: seatDetails.library.id } },
//       },
//       include: {
//         seat: true,
//         library: true,
//       },
//     });

//     // Create payment record for the seat booking
//     const payment = await prisma.payment.create({
//       data: {
//         amount: booking.bookingPrice,
//         currency: booking.currency,
//         type: PaymentType.SEAT_BOOKING,
//         status: PaymentStatus.PENDING,
//         medium: paymentMedium || PaymentMedium.OFFLINE,
//         paymentMethod,
//         user: { connect: { id: userId } },
//         seatBooking: { connect: { id: booking.id } },
//       },
//     });

//     res.status(201).json({ success: true, data: { booking, payment } });
//   } catch (error) {
//     console.error('Error booking seat:', error);
//     res.status(500).json({ success: false, error: 'Internal server error' });
//   }
// };

// // Get user's bookings
// export const getUserBookings = async (req: Request, res: Response) => {
//   try {
//     const userId = (req as any).user.id;

//     const bookings = await prisma.seatBooking.findMany({
//       where: {
//         userId,
//       },
//       include: {
//         seat: {
//           include: {
//             library: {
//               select: {
//                 id: true,
//                 name: true,
//                 address: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         date: 'desc',
//       },
//     });

//     res.json({ success: true, data: bookings });
//   } catch (error) {
//     console.error('Error fetching user bookings:', error);
//     res.status(500).json({ success: false, error: 'Internal server error' });
//   }
// };

// // Cancel booking
// export const cancelBooking = async (req: Request, res: Response) => {
//   try {
//     const { bookingId } = req.params;
//     const userId = (req as any).user.id;

//     const booking = await prisma.seatBooking.update({
//       where: {
//         id: bookingId,
//         userId, // Ensure the booking belongs to the user
//       },
//       data: {
//         status: BookingStatus.CANCELLED,
//       },
//     });

//     res.json({ success: true, data: booking });
//   } catch (error) {
//     console.error('Error cancelling booking:', error);
//     res.status(500).json({ success: false, error: 'Internal server error' });
//   }
// };




