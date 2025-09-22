import { Response } from 'express';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';
import { PaginationHelper } from '../utils/pagination';

export const getEvents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Build filter query
    const filter: any = {};

    if (req.query.active !== undefined) {
      filter.isActive = req.query.active === 'true';
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { 'venue.name': searchRegex },
        { 'venue.address': searchRegex }
      ];
    }

    if (req.query.startDate) {
      filter.startDate = { $gte: new Date(req.query.startDate as string) };
    }

    if (req.query.endDate) {
      filter.endDate = { $lte: new Date(req.query.endDate as string) };
    }

    if (req.query.location) {
      const locationRegex = new RegExp(req.query.location as string, 'i');
      filter.$or = [
        ...(filter.$or || []),
        { 'venue.name': locationRegex },
        { 'venue.address': locationRegex }
      ];
    }

    // Parse pagination
    const pagination = PaginationHelper.parseQuery(req, {
      defaultLimit: 20,
      maxLimit: 100,
      sort: 'startDate',
      sortOrder: 'desc'
    });

    // Execute paginated query
    const result = await PaginationHelper.paginate(
      Event,
      filter,
      pagination,
      {
        populate: 'attendees',
        select: 'name email professionalInfo.title professionalInfo.company'
      }
    );

    // Add additional metadata
    const links = PaginationHelper.generateLinks(
      `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`,
      result.pagination,
      req.query
    );

    res.json({
      events: result.data,
      pagination: result.pagination,
      meta: {
        ...result.meta,
        filters: {
          active: req.query.active,
          search: req.query.search,
          startDate: req.query.startDate,
          endDate: req.query.endDate,
          location: req.query.location
        }
      },
      links
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
      (attendee: any) => attendee._id.toString() === (req.user._id as any).toString()
    ) : false;
    
    res.json({
      event: {
        ...event.toJSON(),
        isAttending,
        attendeeCount: event.attendees.length,
        capacity: event.capacity,
        remainingSpots: event.remainingSpots(),
        hasCapacity: event.hasCapacity()
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
    
    const user = await User.findById(req.user._id as any);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    const isAlreadyAttending = event.attendees.includes(req.user._id as any);
    if (isAlreadyAttending) {
      res.status(400).json({ error: 'Already attending this event' });
      return;
    }

    // Check capacity limits
    if (!event.hasCapacity()) {
      res.status(400).json({
        error: 'Event is at full capacity',
        capacity: event.capacity,
        currentAttendees: event.attendees.length
      });
      return;
    }

    event.attendees.push(req.user._id as any);
    await event.save();
    
    user.currentEvent = event._id as any;
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
      (attendee: any) => attendee._id.toString() === (req.user._id as any).toString()
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
      ...(session as any),
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

export const leaveEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id: eventId } = req.params;
    const userId = req.user._id;
    
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    
    // Check if user is registered for the event
    const isRegistered = event.attendees.some((attendeeId: any) => 
      attendeeId.toString() === userId.toString()
    );
    
    if (!isRegistered) {
      res.status(400).json({ error: 'You are not registered for this event' });
      return;
    }
    
    // Remove user from event attendees
    event.attendees = event.attendees.filter((attendeeId: any) => 
      attendeeId.toString() !== userId.toString()
    );
    await event.save();
    
    // Update user's currentEvent if this was their current event
    const user = await User.findById(userId);
    if (user && user.currentEvent?.toString() === eventId) {
      user.currentEvent = undefined;
      await user.save();
    }
    
    res.json({
      message: 'Successfully left event',
      event: {
        id: event._id,
        name: event.name,
        attendeeCount: event.attendees.length
      }
    });
  } catch (error) {
    console.error('Leave event error:', error);
    res.status(500).json({ error: 'Failed to leave event' });
  }
};