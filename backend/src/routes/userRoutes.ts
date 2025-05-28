import express from 'express';
import { getCurrentUser, syncUser } from '../controllers/userController';



const router = express.Router();

// Import user controller functions
router.get('/profile', getCurrentUser);
router.post("/sync-user", syncUser) 

export default router;
