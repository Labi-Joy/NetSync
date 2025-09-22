import express from 'express';
import { register, login, refresh, getProfile, logout } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation';

const router = express.Router();

// Debug middleware for auth routes
router.use((req, res, next) => {
  console.log(`🔐 AUTH ROUTE HIT: ${req.method} ${req.path}`);
  console.log(`🔐 Full URL: ${req.originalUrl}`);
  console.log(`🔐 Base URL: ${req.baseUrl}`);
  next();
});

// POST /auth/register - User registration
router.post('/register', (req, res, next) => {
  console.log('🎯 REGISTER ROUTE SPECIFICALLY HIT!');
  console.log('🎯 Request body in route:', req.body);
  next();
}, validateUserRegistration, register);

// POST /auth/login - User login
router.post('/login', validateUserLogin, login);

// POST /auth/refresh - Token refresh
router.post('/refresh', refresh);

// GET /auth/profile - Get user profile (protected)
router.get('/profile', authenticateToken, getProfile);

// POST /auth/logout - Logout user (protected)
router.post('/logout', authenticateToken, logout);

export default router;