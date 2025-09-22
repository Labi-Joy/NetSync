import express from 'express';
import { initializeBot, sendMessage, requestIntroduction, getSuggestions, scheduleMeetup, getConversationHistory } from '../controllers/botController';
import { authenticateToken } from '../middleware/auth';
import {
  validateBotInitialization,
  validateBotMessage,
  validateBotIntroduction,
  validateBotMeetupScheduling,
  validateBotSuggestions,
  validateObjectId
} from '../middleware/validation';

const router = express.Router();

// POST /api/bot/initialize - Initialize bot session
router.post('/initialize', authenticateToken, validateBotInitialization, initializeBot);

// POST /api/bot/message - Send message to bot
router.post('/message', authenticateToken, validateBotMessage, sendMessage);

// POST /api/bot/introduce - Bot-facilitated introduction
router.post('/introduce', authenticateToken, validateBotIntroduction, requestIntroduction);

// GET /api/bot/suggestions - Get networking suggestions
router.get('/suggestions', authenticateToken, validateBotSuggestions, getSuggestions);

// POST /api/bot/schedule-meetup - Schedule meetup via bot
router.post('/schedule-meetup', authenticateToken, validateBotMeetupScheduling, scheduleMeetup);

// GET /api/bot/conversations/:conversationId - Get conversation history
router.get('/conversations/:conversationId', authenticateToken, validateObjectId, getConversationHistory);

export default router;