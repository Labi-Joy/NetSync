import express from 'express';
import { register, login, refresh, getProfile, logout } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation';

const router = express.Router();

// POST /auth/register - User registration
router.post('/register', validateUserRegistration, register);

// POST /auth/login - User login
router.post('/login', validateUserLogin, login);

// POST /auth/refresh - Token refresh
router.post('/refresh', refresh);

// GET /auth/profile - Get user profile (protected)
router.get('/profile', authenticateToken, getProfile);

// POST /auth/logout - Logout user (protected)
router.post('/logout', authenticateToken, logout);

export default router;