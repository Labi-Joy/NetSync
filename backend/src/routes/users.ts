import express from 'express';
import { getUserProfile, updateUserProfile, completeOnboarding, getNetworkingStyle } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validateProfileUpdate } from '../middleware/validation';

const router = express.Router();

// GET /api/users/profile - Get current user profile
router.get('/profile', authenticateToken, getUserProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', authenticateToken, validateProfileUpdate, updateUserProfile);

// POST /api/users/onboarding - Complete onboarding process
router.post('/onboarding', authenticateToken, completeOnboarding);

// GET /api/users/networking-style - Get networking preferences
router.get('/networking-style', authenticateToken, getNetworkingStyle);

export default router;