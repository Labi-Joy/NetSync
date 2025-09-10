import express from 'express';
import { findMatches, requestIntroduction, getConnections, updateConnectionStatus, provideFeedback } from '../controllers/networkingController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// POST /api/networking/find-matches - Get potential connections
router.post('/find-matches', authenticateToken, findMatches);

// POST /api/networking/request-introduction - Request bot introduction
router.post('/request-introduction', authenticateToken, requestIntroduction);

// GET /api/networking/connections - Get user's connections
router.get('/connections', authenticateToken, getConnections);

// PUT /api/networking/connections/:id/status - Update connection status
router.put('/connections/:id/status', authenticateToken, updateConnectionStatus);

// POST /api/networking/feedback - Provide connection feedback
router.post('/feedback', authenticateToken, provideFeedback);

export default router;