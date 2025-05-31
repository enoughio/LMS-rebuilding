// routes/dashboardRoutes.ts

import express from 'express';
import { getMemberDashboard, getAdminDashboard, getSuperAdminDashboard } from '../controllers/dashboardController.js';
import { authenticate, verifyToken } from '../middelware/authMiddelware.js';


const router = express.Router();

/**
 * GET /api/dashboard/member
 * Member dashboard route (Only accessible by authenticated users with MEMBER role)
 */
router.get('/super-admin', verifyToken, authenticate, getSuperAdminDashboard);
router.get('/admin', verifyToken, authenticate, getAdminDashboard);
router.get('/member', verifyToken, authenticate, getMemberDashboard);

export default router;
