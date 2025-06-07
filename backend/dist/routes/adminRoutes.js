import { Router } from 'express';
import { getAdminDashboardData } from '../controllers/adminDashboardController.js';
import { authenticate, authorizeRoles, verifyToken } from '../middelware/authMiddelware.js';
import { UserRole } from '../../generated/prisma/index.js';
const router = Router();
// Get admin dashboard data
router.get('/dashboard', verifyToken, authenticate, authorizeRoles(UserRole.ADMIN), getAdminDashboardData);
export default router;
//# sourceMappingURL=adminRoutes.js.map