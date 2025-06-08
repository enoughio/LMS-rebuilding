import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

// Get all seat bookings for a library
export const getSeatBookings = async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;

    if (!libraryId) {
      res.status(400).json({ error: 'Library ID is required' });
      return
    }

    const bookings = await prisma.seatBooking.findMany({
      where: {
        libraryId: libraryId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        seat: {
          select: {
            id: true,
            name: true,
            seatType: true
          }
        },
        library: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });    // Transform the data to match frontend expectations
    const transformedBookings = bookings.map(booking => ({
      id: booking.id,
      userName: booking.user?.name || 'Guest',
      userEmail: booking.user?.email || 'N/A',
      userAvatar: booking.user?.avatar || null,
      seatName: booking.seat.name,
      seatType: booking.seat.seatType,      date: booking.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      bookingPrice: booking.bookingPrice,
      createdAt: booking.createdAt
    }));

    res.status(200).json(transformedBookings);

  } catch (error) {
    console.error('Error fetching seat bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Cancel a seat booking
export const cancelSeatBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      res.status(400).json({ error: 'Booking ID is required' });
      return;
    }

    // Check if booking exists and is not already cancelled or completed
    const existingBooking = await prisma.seatBooking.findUnique({
      where: { id: bookingId },
      include: {
        library: true,
        seat: true
      }
    });

    if (!existingBooking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (existingBooking.status === 'CANCELLED' || existingBooking.status === 'COMPLETED') {
      res.status(400).json({ 
        error: `Cannot cancel booking that is already ${existingBooking.status.toLowerCase()}` 
      });
      return;
    }    // Update booking status to cancelled
    const updatedBooking = await prisma.seatBooking.delete({
      where: { id: bookingId },
      select: {
        id: true,
        user: {
          select: {
            name: true
          }
        },
        seat: {
          select: {
            name: true
          }
        },
        status: true,
        date: true
      }
    });    res.status(200).json({
      message: 'Booking cancelled successfully',
      booking: {
        id: updatedBooking.id,
        userName: updatedBooking.user?.name || 'Guest',
        seatName: updatedBooking.seat.name,
        status: updatedBooking.status,
        date: updatedBooking.date.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Complete a seat booking
export const completeSeatBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      res.status(400).json({ error: 'Booking ID is required' });
      return; 
    }

    // Check if booking exists and is not already cancelled or completed
    const existingBooking = await prisma.seatBooking.findUnique({
      where: { id: bookingId },
      include: {
        library: true,
        seat: true
      }
    });

    if (!existingBooking) {
      res.status(404).json({ error: 'Booking not found' });
      return
    }

    if (existingBooking.status === 'CANCELLED' || existingBooking.status === 'COMPLETED') {
      res.status(400).json({ 
        error: `Cannot complete booking that is already ${existingBooking.status.toLowerCase()}` 
      });
      return;
    }

    // Update booking status to completed
    const updatedBooking = await prisma.seatBooking.update({
      where: { id: bookingId },
      data: { status: 'COMPLETED' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        seat: {
          select: {
            id: true,
            name: true,
            seatType: true
          }
        }      }
    });

    res.status(200).json({
      message: 'Booking completed successfully',
      booking: {
        id: updatedBooking.id,
        userName: updatedBooking.user?.name || 'Guest',
        seatName: updatedBooking.seat.name,
        status: updatedBooking.status,
        date: updatedBooking.date.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('Error completing booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get bookings by date range (optional - for filtering)
export const getSeatBookingsByDateRange = async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;
    const { startDate, endDate, status } = req.query;

    if (!libraryId) {
      res.status(400).json({ error: 'Library ID is required' });
      return;
    }

    const whereClause: any = {
      libraryId: libraryId
    };

    // Add date range filter if provided
    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    // Add status filter if provided
    if (status && status !== 'all') {
      whereClause.status = (status as string).toUpperCase();
    }

    const bookings = await prisma.seatBooking.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        seat: {
          select: {
            id: true,
            name: true,
            seatType: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });    // Transform the data to match frontend expectations
    const transformedBookings = bookings.map(booking => ({
      id: booking.id,
      userName: booking.user?.name || 'Guest',
      userEmail: booking.user?.email || 'N/A',
      userAvatar: booking.user?.avatar || null,
      seatName: booking.seat.name,
      seatType: booking.seat.seatType,
      date: booking.date.toISOString().split('T')[0],
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status.toLowerCase(),
      totalAmount: booking.bookingPrice,
      createdAt: booking.createdAt
    }));

    res.status(200).json(transformedBookings);

  } catch (error) {
    console.error('Error fetching bookings by date range:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
