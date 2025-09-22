import { Response } from 'express';
import { Connection } from '../models/Connection';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';
import { MatchingService } from '../services/matchingService';
import PaginationHelper from '../utils/pagination';

const matchingService = new MatchingService();

export const findMatches = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { eventId, limit = 10 } = req.method === 'GET' ? req.query : req.body;
    
    if (!req.user.currentEvent) {
      res.status(400).json({ error: 'Must be attending an event to find matches' });
      return;
    }
    
    const matches = await matchingService.findMatches(
      (req.user._id as any).toString(),
      eventId || req.user.currentEvent!.toString(),
      parseInt(limit as string)
    );
    
    res.json({
      matches,
      count: matches.length
    });
  } catch (error) {
    console.error('Find matches error:', error);
    res.status(500).json({ error: 'Failed to find matches' });
  }
};

export const requestIntroduction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { targetUserId, eventId } = req.body;
    
    if (!req.user.currentEvent && !eventId) {
      res.status(400).json({ error: 'Event context required' });
      return;
    }
    
    const currentEventId = eventId || req.user.currentEvent!.toString();
    
    // First find a match to get match data
    const matches = await matchingService.findMatches((req.user._id as any).toString(), currentEventId, 50);
    const targetMatch = matches.find(match => match.user._id.toString() === targetUserId);
    
    if (!targetMatch) {
      res.status(404).json({ error: 'Target user not found in potential matches' });
      return;
    }
    
    const connection = await matchingService.createConnection(
      currentEventId,
      (req.user._id as any).toString(),
      targetUserId,
      targetMatch
    );
    
    res.json({
      message: 'Introduction request created successfully',
      connection
    });
  } catch (error) {
    console.error('Request introduction error:', error);
    if (error instanceof Error && error.message === 'Connection already exists') {
      res.status(409).json({ error: 'Connection already exists' });
    } else {
      res.status(500).json({ error: 'Failed to request introduction' });
    }
  }
};

export const getConnections = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, eventId } = req.query;
    
    const query: any = {
      participants: req.user._id
    };
    
    if (status) {
      query.status = status;
    }
    
    if (eventId) {
      query.eventId = eventId;
    } else if (req.user.currentEvent) {
      query.eventId = req.user.currentEvent;
    }
    
    const connections = await Connection.find(query)
      .populate('participants', 'name email professionalInfo profilePicture')
      .populate('eventId', 'name startDate endDate')
      .sort({ createdAt: -1 });
    
    const formattedConnections = connections.map(connection => {
      const otherParticipant = connection.participants.find(
        (participant: any) => participant._id.toString() !== (req.user._id as any).toString()
      );
      
      return {
        ...connection.toJSON(),
        otherParticipant,
        participants: undefined // Remove full participants array for cleaner response
      };
    });
    
    res.json({
      connections: formattedConnections,
      count: formattedConnections.length
    });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ error: 'Failed to get connections' });
  }
};

export const updateConnectionStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    
    const validStatuses = ['suggested', 'introduced', 'connected', 'met', 'collaborated'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }
    
    const connection = await Connection.findOne({
      _id: id,
      participants: req.user._id
    });
    
    if (!connection) {
      res.status(404).json({ error: 'Connection not found' });
      return;
    }
    
    await connection.updateStatus(status, feedback ? { feedback } : undefined);
    await connection.populate('participants', 'name email professionalInfo profilePicture');
    
    const otherParticipant = connection.participants.find(
      (participant: any) => participant._id.toString() !== (req.user._id as any).toString()
    );
    
    res.json({
      message: 'Connection status updated successfully',
      connection: {
        ...connection.toJSON(),
        otherParticipant,
        participants: undefined
      }
    });
  } catch (error) {
    console.error('Update connection status error:', error);
    res.status(500).json({ error: 'Failed to update connection status' });
  }
};

export const provideFeedback = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { connectionId, rating, comment, tags } = req.body;
    
    const connection = await Connection.findOne({
      _id: connectionId,
      participants: req.user._id
    });
    
    if (!connection) {
      res.status(404).json({ error: 'Connection not found' });
      return;
    }
    
    await connection.addInteraction('feedback', {
      userId: req.user._id as any,
      rating,
      comment,
      tags
    });
    
    res.json({
      message: 'Feedback submitted successfully',
      connection: connection.toJSON()
    });
  } catch (error) {
    console.error('Provide feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

export const skipMatch = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { matchId, userId } = req.body;
    
    if (!matchId) {
      res.status(400).json({ error: 'Match ID is required' });
      return;
    }
    
    // Here you would typically:
    // 1. Log the skip action for analytics
    // 2. Update user preferences to avoid similar matches
    // 3. Store skip data for machine learning improvements
    
    console.log(`User ${req.user._id} skipped match ${matchId}`);
    
    res.json({
      message: 'Match skipped successfully',
      matchId,
      userId: req.user._id
    });
  } catch (error) {
    console.error('Skip match error:', error);
    res.status(500).json({ error: 'Failed to skip match' });
  }
};

// Enhanced user search with pagination
export const searchUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Build filter query
    const filter: any = {};

    // Text search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filter.$or = [
        { name: searchRegex },
        { 'professionalInfo.title': searchRegex },
        { 'professionalInfo.company': searchRegex }
      ];
    }

    // Skills filter
    if (req.query.skills) {
      const skills = (req.query.skills as string).split(',').map(s => s.trim());
      filter['professionalInfo.skills'] = { $in: skills };
    }

    // Interests filter
    if (req.query.interests) {
      const interests = (req.query.interests as string).split(',').map(i => i.trim());
      filter['professionalInfo.interests'] = { $in: interests };
    }

    // Experience level filter
    if (req.query.experience) {
      filter['professionalInfo.experience'] = req.query.experience;
    }

    // Company filter
    if (req.query.company) {
      filter['professionalInfo.company'] = new RegExp(req.query.company as string, 'i');
    }

    // Title filter
    if (req.query.title) {
      filter['professionalInfo.title'] = new RegExp(req.query.title as string, 'i');
    }

    // Exclude current user
    filter._id = { $ne: req.user._id };

    // Parse pagination
    const pagination = PaginationHelper.parseQuery(req, {
      defaultLimit: 20,
      maxLimit: 100,
      sort: 'name',
      sortOrder: 'asc'
    });

    // Execute paginated query
    const result = await PaginationHelper.paginate(
      User,
      filter,
      pagination,
      {
        select: '-password -refreshTokens',
        lean: true
      }
    );

    res.json({
      users: result.data,
      pagination: result.pagination,
      meta: {
        ...result.meta,
        filters: {
          search: req.query.search,
          skills: req.query.skills,
          interests: req.query.interests,
          experience: req.query.experience,
          company: req.query.company,
          title: req.query.title
        }
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
};

// Get connections with enhanced pagination
export const getConnectionsEnhanced = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Build filter query
    const filter: any = {
      participants: req.user._id
    };

    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Event filter
    if (req.query.eventId) {
      filter.eventId = req.query.eventId;
    }

    // Minimum score filter
    if (req.query.minScore) {
      filter.matchScore = { $gte: parseFloat(req.query.minScore as string) };
    }

    // Date range filters
    if (req.query.dateFrom || req.query.dateTo) {
      filter.createdAt = {};
      if (req.query.dateFrom) {
        filter.createdAt.$gte = new Date(req.query.dateFrom as string);
      }
      if (req.query.dateTo) {
        filter.createdAt.$lte = new Date(req.query.dateTo as string);
      }
    }

    // Parse pagination
    const pagination = PaginationHelper.parseQuery(req, {
      defaultLimit: 20,
      maxLimit: 100,
      sort: 'createdAt',
      sortOrder: 'desc'
    });

    // Execute paginated query
    const result = await PaginationHelper.paginate(
      Connection,
      filter,
      pagination,
      {
        populate: 'participants eventId',
        select: 'name email professionalInfo'
      }
    );

    res.json({
      connections: result.data,
      pagination: result.pagination,
      meta: {
        ...result.meta,
        filters: {
          status: req.query.status,
          eventId: req.query.eventId,
          minScore: req.query.minScore,
          dateFrom: req.query.dateFrom,
          dateTo: req.query.dateTo
        }
      }
    });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ error: 'Failed to get connections' });
  }
};