import express from 'express';
import { authenticate, authorizeRoles, verifyToken } from '../middelware/authMiddelware.js';
import { UserRole } from '../../generated/prisma/index.js';
import { getLibraryProfile, updateLibraryProfile } from '../controllers/libraryProfileController.js';
import { uploadMultiple } from '../lib/multer.config.js';

const router = express.Router();

// Middleware to authenticate all library profile routes
router.use( verifyToken ,authenticate);

// Get library profile for admin
router.get('/', authorizeRoles([UserRole.ADMIN]), getLibraryProfile);

// Update library profile for admin with image upload support
router.put('/', 
  authorizeRoles([UserRole.ADMIN]), 
  uploadMultiple('images', 10), // Allow up to 10 images
  updateLibraryProfile
);

export default router;
