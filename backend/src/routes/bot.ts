import express from 'express';
import { initializeBot, sendMessage, requestIntroduction, getSuggestions, scheduleMeetup, getConversationHistory } from '../controllers/botController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// POST /api/bot/initialize - Initialize bot session
router.post('/initialize', authenticateToken, initializeBot);

// POST /api/bot/message - Send message to bot
router.post('/message', authenticateToken, sendMessage);

// POST /api/bot/introduce - Bot-facilitated introduction
router.post('/introduce', authenticateToken, requestIntroduction);

// GET /api/bot/suggestions - Get networking suggestions
router.get('/suggestions', authenticateToken, getSuggestions);

// POST /api/bot/schedule-meetup - Schedule meetup via bot
router.post('/schedule-meetup', authenticateToken, scheduleMeetup);

// GET /api/bot/conversations/:conversationId - Get conversation history
router.get('/conversations/:conversationId', authenticateToken, getConversationHistory);

export default router;