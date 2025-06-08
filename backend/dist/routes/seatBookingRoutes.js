import { Router } from "express";
import { getSeatBookings, cancelSeatBooking, completeSeatBooking, getSeatBookingsByDateRange } from "../controllers/seatBookingController.js";
const router = Router();
// Get all seat bookings for a library
router.get('/:libraryId', getSeatBookings);
// Get seat bookings by date range and filters
router.get('/:libraryId/filter', getSeatBookingsByDateRange);
// Cancel a seat booking
router.patch('/:bookingId/cancel', cancelSeatBooking);
// Complete a seat booking
router.patch('/:bookingId/complete', completeSeatBooking);
export default router;
//# sourceMappingURL=seatBookingRoutes.js.map