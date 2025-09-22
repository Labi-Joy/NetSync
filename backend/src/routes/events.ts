import express from 'express';
import { getEvents, getEventById, joinEvent, leaveEvent, getEventAttendees, getEventSchedule } from '../controllers/eventController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = express.Router();

// GET /api/events - List events
router.get('/', optionalAuth, getEvents);

// GET /api/events/:id - Get specific event
router.get('/:id', optionalAuth, getEventById);

// POST /api/events/:id/join - Join event
router.post('/:id/join', authenticateToken, joinEvent);

// POST /api/events/:id/leave - Leave event
router.post('/:id/leave', authenticateToken, leaveEvent);

// GET /api/events/:id/attendees - Get event attendees
router.get('/:id/attendees', authenticateToken, getEventAttendees);

// GET /api/events/:id/schedule - Get event schedule
router.get('/:id/schedule', optionalAuth, getEventSchedule);

export default router;