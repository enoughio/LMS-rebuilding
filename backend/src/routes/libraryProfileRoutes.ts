import express from 'express';
import { authenticate, authorizeRoles, verifyToken } from '../middelware/authMiddelware.js';
import { UserRole } from '../../generated/prisma/index.js';
import { getLibraryProfile, updateLibraryProfile } from '../controllers/libraryProfileController.js';

const router = express.Router();

// Middleware to authenticate all library profile routes
router.use( verifyToken ,authenticate);

// Get library profile for admin
router.get('/', authorizeRoles([UserRole.ADMIN]), getLibraryProfile);

// Update library profile for admin
router.put('/', authorizeRoles([UserRole.ADMIN]), updateLibraryProfile);

export default router;
