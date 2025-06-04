// routes/dashboardRoutes.ts

import express from 'express';
import { getPlatformGrowthController, getRevenueController, getStatsController, getSuperAdminDashboard } from '../controllers/dashboardController.js';
// import { getTopLibraries } from '../controllers/libraryController.js';
import { authenticate, authorizeRoles, verifyToken } from '../middelware/authMiddelware.js';
import { UserRole } from '../../generated/prisma/index.js';
import { getTopLibraries } from '../controllers/libraryController.js';
// import { UserRole } from '../../generated/prisma/index.js';


const router = express.Router();

/**
 * GET /api/dashboard/member
 * Member dashboard route (Only accessible by authenticated users with MEMBER role)
 */
router.get('/SUPER_ADMIN', verifyToken, authenticate, authorizeRoles(UserRole.SUPER_ADMIN), getSuperAdminDashboard);
router.get("/top", verifyToken, authenticate, authorizeRoles(UserRole.SUPER_ADMIN),  getTopLibraries); // Get top libraries for super admin dashboard
// router.get("/revenue",  getRevenue); // Get revenue for super admin dashboard
router.get('/stats', verifyToken, authenticate, authorizeRoles(UserRole.SUPER_ADMIN), getStatsController);
router.get('/revenue', verifyToken, authenticate, authorizeRoles(UserRole.SUPER_ADMIN), getRevenueController);
router.get('/growth', verifyToken, authenticate, authorizeRoles(UserRole.SUPER_ADMIN), getPlatformGrowthController);

// router.get('/admin', verifyToken, authenticate, getAdminDashboard);
// router.get('/member', verifyToken, authenticate, getMemberDashboard);



export default router;
