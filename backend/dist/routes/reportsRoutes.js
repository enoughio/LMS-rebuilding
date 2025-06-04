import express from 'express';
import { getRevenueReports, getUserActivityReports, getLibraryPerformanceReports, getBookingAnalytics, getReportsOverview, getLibrariesForReports } from '../controllers/reportsController.js';
import { authenticate, authorizeRoles, verifyToken } from '../middelware/authMiddelware.js';
import { UserRole } from '../../generated/prisma/index.js';
const router = express.Router();
// All routes require SUPER_ADMIN role
const adminAuth = [verifyToken, authenticate, authorizeRoles(UserRole.SUPER_ADMIN)];
/**
 * @route GET /api/reports/overview
 * @desc Get comprehensive reports overview with key metrics
 * @access Private (Super Admin only)
 * @query libraryId - Optional library filter
 */
router.get('/overview', ...adminAuth, getReportsOverview);
/**
 * @route GET /api/reports/revenue
 * @desc Get detailed revenue reports with monthly breakdown
 * @access Private (Super Admin only)
 * @query startDate - Start date (ISO string)
 * @query endDate - End date (ISO string)
 * @query libraryId - Optional library filter
 */
router.get('/revenue', ...adminAuth, getRevenueReports);
/**
 * @route GET /api/reports/users
 * @desc Get user activity and growth reports
 * @access Private (Super Admin only)
 * @query startDate - Start date (ISO string)
 * @query endDate - End date (ISO string)
 * @query libraryId - Optional library filter
 */
router.get('/users', getUserActivityReports);
/**
 * @route GET /api/reports/libraries
 * @desc Get library performance reports
 * @access Private (Super Admin only)
 * @query startDate - Start date (ISO string)
 * @query endDate - End date (ISO string)
 * @query libraryId - Optional library filter
 */
router.get('/libraries', ...adminAuth, getLibraryPerformanceReports);
/**
 * @route GET /api/reports/bookings
 * @desc Get booking analytics and trends
 * @access Private (Super Admin only)
 * @query startDate - Start date (ISO string)
 * @query endDate - End date (ISO string)
 * @query libraryId - Optional library filter
 */
router.get('/bookings', ...adminAuth, getBookingAnalytics);
/**
 * @route GET /api/reports/libraries-list
 * @desc Get list of all libraries for filter dropdown
 * @access Private (Super Admin only)
 */
router.get('/libraries-list', ...adminAuth, getLibrariesForReports);
export default router;
//# sourceMappingURL=reportsRoutes.js.map