import { Response } from 'express';
import { Connection } from '../models/Connection';
import { AuthenticatedRequest } from '../middleware/auth';
import { MatchingService } from '../services/matchingService';

const matchingService = new MatchingService();

export const findMatches = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { eventId, limit = 10 } = req.body;
    
    if (!req.user.currentEvent) {
      res.status(400).json({ error: 'Must be attending an event to find matches' });
      return;
    }
    
    const matches = await matchingService.findMatches(
      req.user._id.toString(),
      eventId || req.user.currentEvent.toString(),
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
    
    const currentEventId = eventId || req.user.currentEvent.toString();
    
    // First find a match to get match data
    const matches = await matchingService.findMatches(req.user._id.toString(), currentEventId, 50);
    const targetMatch = matches.find(match => match.user._id.toString() === targetUserId);
    
    if (!targetMatch) {
      res.status(404).json({ error: 'Target user not found in potential matches' });
      return;
    }
    
    const connection = await matchingService.createConnection(
      currentEventId,
      req.user._id.toString(),
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
        (participant: any) => participant._id.toString() !== req.user._id.toString()
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
      (participant: any) => participant._id.toString() !== req.user._id.toString()
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
      userId: req.user._id,
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