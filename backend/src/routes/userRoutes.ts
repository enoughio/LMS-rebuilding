import express from 'express';
import { getCurrentUser, syncUser } from '../controllers/userController.js';
import {  verifyToken } from '../middleware/authMiddelware.js';



const router = express.Router();

// Import user controller functions
router.get('/me', verifyToken, getCurrentUser);
router.post("/sync-user", verifyToken, syncUser) 

export default router;
