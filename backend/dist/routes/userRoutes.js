import express from 'express';
import { getCurrentUser, syncUser, getAllUsers } from '../controllers/userController.js';
import { authenticate, authorizeRoles, verifyToken } from '../middelware/authMiddelware.js';
import { UserRole } from '../../generated/prisma/index.js';
const router = express.Router();
// Import user controller functions
router.get('/me', verifyToken, getCurrentUser);
router.post("/sync-user", verifyToken, syncUser);
// superadmin routes
router.get('/all', verifyToken, authenticate, authorizeRoles(UserRole.SUPER_ADMIN), getAllUsers);
export default router;
//# sourceMappingURL=userRoutes.js.map