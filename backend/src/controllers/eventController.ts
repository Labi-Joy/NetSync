import { Response } from 'express';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';

export const getEvents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { active, limit = 10, page = 1 } = req.query;
    
    const query: any = {};
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * limitNum;
    
    const events = await Event.find(query)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('attendees', 'name email professionalInfo.title professionalInfo.company');
    
    const total = await Event.countDocuments(query);
    
    res.json({
      events,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        count: events.length,
        totalEvents: total
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to get events' });
  }
};

export const getEventById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id)
      .populate('attendees', 'name email professionalInfo.title professionalInfo.company profilePicture');
    
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    
    const isAttending = req.user ? event.attendees.some(
      (attendee: any) => attendee._id.toString() === req.user._id.toString()
    ) : false;
    
    res.json({
      event: {
        ...event.toJSON(),
        isAttending,
        attendeeCount: event.attendees.length
      }
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ error: 'Failed to get event' });
  }
};

export const joinEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    
    if (!event.isActive) {
      res.status(400).json({ error: 'Event is not active' });
      return;
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    const isAlreadyAttending = event.attendees.includes(req.user._id);
    if (isAlreadyAttending) {
      res.status(400).json({ error: 'Already attending this event' });
      return;
    }
    
    event.attendees.push(req.user._id);
    await event.save();
    
    user.currentEvent = event._id;
    await user.save();
    
    res.json({
      message: 'Successfully joined event',
      event: {
        _id: event._id,
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate
      }
    });
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({ error: 'Failed to join event' });
  }
};

export const getEventAttendees = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id)
      .populate('attendees', 'name email professionalInfo profilePicture networkingProfile');
    
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    
    const isAttending = req.user ? event.attendees.some(
      (attendee: any) => attendee._id.toString() === req.user._id.toString()
    ) : false;
    
    if (!isAttending && req.user) {
      res.status(403).json({ error: 'Must be attending event to view attendees' });
      return;
    }
    
    res.json({
      attendees: event.attendees,
      count: event.attendees.length
    });
  } catch (error) {
    console.error('Get event attendees error:', error);
    res.status(500).json({ error: 'Failed to get event attendees' });
  }
};

export const getEventSchedule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id).select('schedule venue');
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    
    const now = new Date();
    const scheduleWithStatus = event.schedule.map(session => ({
      ...session.toJSON(),
      status: session.endTime < now ? 'completed' : 
              session.startTime <= now && session.endTime > now ? 'ongoing' : 'upcoming'
    }));
    
    res.json({
      schedule: scheduleWithStatus,
      venue: event.venue
    });
  } catch (error) {
    console.error('Get event schedule error:', error);
    res.status(500).json({ error: 'Failed to get event schedule' });
  }
};