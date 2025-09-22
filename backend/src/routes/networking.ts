import express from 'express';
import { findMatches, requestIntroduction, getConnections, updateConnectionStatus, provideFeedback, skipMatch, searchUsers, getConnectionsEnhanced } from '../controllers/networkingController';
import { authenticateToken } from '../middleware/auth';
import { validateUserFilters, validateMatchFilters, validateAdvancedPagination } from '../middleware/validation';

const router = express.Router();

// GET /api/networking/matches - Get potential connections
router.get('/matches', authenticateToken, findMatches);

// POST /api/networking/find-matches - Get potential connections (legacy endpoint)
router.post('/find-matches', authenticateToken, findMatches);

// POST /api/networking/introduce - Request bot introduction
router.post('/introduce', authenticateToken, requestIntroduction);

// POST /api/networking/request-introduction - Request bot introduction (legacy endpoint)
router.post('/request-introduction', authenticateToken, requestIntroduction);

// GET /api/networking/connections - Get user's connections
router.get('/connections', authenticateToken, getConnections);

// PUT /api/networking/connections/:id/status - Update connection status
router.put('/connections/:id/status', authenticateToken, updateConnectionStatus);

// POST /api/networking/feedback - Provide connection feedback
router.post('/feedback', authenticateToken, provideFeedback);

// POST /api/networking/skip-match - Skip a potential match
router.post('/skip-match', authenticateToken, skipMatch);

// GET /api/networking/users/search - Search users with advanced filtering
router.get('/users/search', authenticateToken, validateUserFilters, searchUsers);

// GET /api/networking/connections-enhanced - Get connections with enhanced pagination
router.get('/connections-enhanced', authenticateToken, validateMatchFilters, getConnectionsEnhanced);

export default router;