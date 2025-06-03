import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { BookingStatus, SeatType } from '../../generated/prisma/index.js';

// Get all seats in a library
export const getLibrarySeats = async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;

    const seats = await prisma.seat.findMany({
      where: {
        libraryId,
      },
      include: {
        bookings: {
          where: {
            status: BookingStatus.CONFIRMED,
          },
          select: {
            date: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    res.json({ success: true, data: seats });
  } catch (error) {
    console.error('Error fetching library seats:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Get seat availability for a specific date
export const getSeatAvailability = async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      return res.status(400).json({ success: false, error: 'Date is required' });
    }

    const queryDate = new Date(date);

    const seats = await prisma.seat.findMany({
      where: {
        libraryId,
      },
      include: {
        bookings: {
          where: {
            AND: [
              { date: queryDate },
              { status: BookingStatus.CONFIRMED },
            ],
          },
        },
      },
    });

    // Transform the data to show availability slots
    const availability = seats.map(seat => {
      const bookedSlots = seat.bookings.map(booking => ({
        date: booking.date,
        start: booking.startTime,
        end: booking.endTime,
      }));

      return {
        seatId: seat.id,
        name: seat.name,
        type: seat.seatType,
        bookedSlots,
      };
    });

    res.json({ success: true, data: availability });
  } catch (error) {
    console.error('Error fetching seat availability:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Create a new seat
export const createSeat = async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;
    const { name, seatType } = req.body;

    const seat = await prisma.seat.create({
      data: {
        name,
        seatType,
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
    const updateData = req.body;

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
    const userId = (req as any).user.id;
    const { seatId, date, startTime, endTime } = req.body;

    // Check if user has an active membership
    const userMembership = await prisma.membership.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        endDate: {
          gte: new Date(),
        },
      },
    });

    if (!userMembership) {
      return res.status(403).json({
        success: false,
        error: 'Active membership required for booking',
      });
    }

    // Get seat details and pricing
    const seatDetails = await prisma.seat.findUnique({
      where: { id: seatId },
      include: {
        library: {
          include: {
            seatPrices: true,
          },
        },
      },
    });

    if (!seatDetails) {
      return res.status(404).json({
        success: false,
        error: 'Seat not found',
      });
    }

    // Calculate duration and price
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const duration = (endHour - startHour) + (endMinute - startMinute) / 60;

    const seatPrice = seatDetails.library.seatPrices.find(
      price => price.seatType === seatDetails.seatType
    );
    const bookingPrice = seatPrice ? (seatPrice.isHourly ? seatPrice.price * duration : seatPrice.price) : 0;

    // Check if the seat is available for the requested time
    const existingBooking = await prisma.seatBooking.findFirst({
      where: {
        seatId,
        date: new Date(date),
        status: BookingStatus.CONFIRMED,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        error: 'Seat is not available for the requested time slot',
      });
    }

    // Create the booking
    const booking = await prisma.seatBooking.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
        duration,
        bookingPrice,
        status: BookingStatus.CONFIRMED,
        user: { connect: { id: userId } },
        seat: { connect: { id: seatId } },
        library: { connect: { id: seatDetails.library.id } },
      },
      include: {
        seat: true,
        library: true,
      },
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error booking seat:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Get user's bookings
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const bookings = await prisma.seatBooking.findMany({
      where: {
        userId,
      },
      include: {
        seat: {
          include: {
            library: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
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
    const userId = (req as any).user.id;

    const booking = await prisma.seatBooking.update({
      where: {
        id: bookingId,
        userId, // Ensure the booking belongs to the user
      },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}; 