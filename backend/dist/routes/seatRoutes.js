import express from 'express';
// import { authenticate, authorizeRoles } from '../middelware/authMiddelware.js';
// import { UserRole } from '../../generated/prisma/index.js';
import { getLibrarySeats, getSeatAvailability, createSeat, updateSeat, deleteSeat, bookSeat, getUserBookings, cancelBooking, downloadBill, } from '../controllers/seatController.js';
import { createSeatType, deleteSeatType, getSeatTypes, updateSeatType } from '../controllers/seatTypeController.js';
import { authenticate, verifyToken } from '../middelware/authMiddelware.js';
// import { authenticate, verifyToken } from '../middelware/authMiddelware.js';
const router = express.Router();
// Middleware to authenticate all seat routes
// router.use(authenticate);
// // Get all seats in a library
router.get('/:libraryId', getLibrarySeats);
// // Get seat availability for a specific date
router.get('/:libraryId/availability', getSeatAvailability);
// // Create a new seat (Admin only)
router.post('/library/:libraryId', 
// authorizeRoles([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
createSeat);
// Update seat details (Admin only)
router.put('/seats/:seatId', 
// authorizeRoles([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
updateSeat);
// Delete a seat (Admin only)
router.delete('/seats/:seatId', 
// authorizeRoles([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
deleteSeat);
// Book a seat
router.post('/:libraryId/book', verifyToken, authenticate, bookSeat);
// Book a seat as guest (no authentication required)
router.post('/:libraryId/book-guest', bookSeat);
// Get user's bookings
router.get('/my-bookings', verifyToken, authenticate, getUserBookings);
// Cancel booking
router.post('/cancel/:bookingId', verifyToken, authenticate, cancelBooking);
// Download booking bill
router.get('/download-bill/:bookingId', verifyToken, authenticate, downloadBill);
// Seat Type Routes
router.get('/seattype/:libraryId', getSeatTypes);
router.post('/seattype/:libraryId', createSeatType);
router.patch('/seattype/:id', updateSeatType);
router.delete('/seattype/:id', deleteSeatType);
export default router;
//# sourceMappingURL=seatRoutes.js.map