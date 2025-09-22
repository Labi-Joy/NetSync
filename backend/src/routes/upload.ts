import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { uploadProfilePicture as uploadMiddleware } from '../middleware/upload';
import { uploadProfilePicture, deleteProfilePicture } from '../controllers/uploadController';

const router = express.Router();

// All upload routes require authentication
router.use(authenticateToken);

// Profile picture upload
router.post('/profile-picture', uploadMiddleware, uploadProfilePicture);
router.delete('/profile-picture', deleteProfilePicture);

export default router;