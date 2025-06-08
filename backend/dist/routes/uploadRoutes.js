import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { authenticate, verifyToken } from '../middelware/authMiddelware.js';
const router = express.Router();
// Upload image route - requires authentication
router.post('/image', verifyToken, authenticate, uploadImage);
// Delete image route - requires authentication
router.delete('/image', verifyToken, authenticate, deleteImage);
export default router;
//# sourceMappingURL=uploadRoutes.js.map