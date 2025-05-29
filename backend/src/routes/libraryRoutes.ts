import express from 'express';
import * as libraryController from '../controllers/libraryController.js';
// import { authenticate,  authorizeRoles } from '../middleware/authMiddelware.js';
// import { ALL_PERMISSIONS } from '../utils/permissions';

const router = express.Router();

// // Public routes for library listings
router.get('/', libraryController.getAllLibraries); // Anyone can view approved libraries
// router.get('/featured', libraryController.getFeaturedLibraries); // Get featured libraries for homepage
// router.get('/search', libraryController.searchLibraries); // Search libraries by name, location, etc.
// router.get('/nearby', libraryController.getNearbyLibraries); // Get libraries near user's location

// // Individual library detail routes
// router.get('/:id', libraryController.getLibraryById); // View a specific library
// router.get('/:id/books', libraryController.getLibraryBooks); // View books in a specific library
// router.get('/:id/events', libraryController.getLibraryEvents); // View upcoming events at a library
// router.get('/:id/membership-plans', libraryController.getLibraryMembershipPlans); // Get membership plans
// // router.get('/:id/seats', libraryController.getLibrarySeats); // Get available seats info
// // router.get('/:id/', libraryController.getLibraryReviews); // Get reviews for a specific library

// // Protected routes
// router.post('/register', authenticate, authorizeRoles(UserRole.ADMIN), libraryController.registerLibrary);
// router.get('/admin/dashboard', authenticate, authorizeRoles(UserRole.ADMIN), libraryController.getAdminDashboard);
// router.post('/:libraryId/updateseats', authenticate, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN), libraryController.updateLibrarySeats);
// //some more routes


// // Admin library management routes (protected)
// router.put('/:id', authenticate, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN), libraryController.updateLibrary);
// router.post('/:id/books', authenticate, authorizeRoles(UserRole.ADMIN), libraryController.addBook);
// router.get('/:id/members', authenticate, authorizeRoles(UserRole.ADMIN), libraryController.getLibraryMembers);

// // Super Admin routes
// router.get('/admin/requests', authenticate, authorizeRoles(UserRole.SUPER_ADMIN), libraryController.getLibraryRequests);
// router.get('/admin/requests/:id', authenticate, authorizeRoles(UserRole.SUPER_ADMIN), libraryController.getLibraryRequestById);
// router.patch('/:id/approve', authenticate, authorizeRoles(UserRole.SUPER_ADMIN), libraryController.approveLibrary);
// router.patch('/:id/reject', authenticate, authorizeRoles(UserRole.SUPER_ADMIN), libraryController.rejectLibrary);
// router.delete('/:id', authenticate, authorizeRoles(UserRole.SUPER_ADMIN), libraryController.deleteLibrary);

export default router;