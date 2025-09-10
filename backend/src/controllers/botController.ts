import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { SensayService } from '../services/sensayService';

const sensayService = new SensayService();

export const initializeBot = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.body;
    
    const currentEventId = eventId || req.user.currentEvent?.toString();
    if (!currentEventId) {
      res.status(400).json({ error: 'Event context required' });
      return;
    }
    
    const conversationId = await sensayService.initializeSession(
      req.user._id.toString(),
      currentEventId
    );
    
    res.json({
      message: 'Bot session initialized successfully',
      conversationId,
      welcomeMessage: 'Hello! I\'m your networking assistant. I\'m here to help you make meaningful connections at this event. How can I assist you today?'
    });
  } catch (error) {
    console.error('Initialize bot error:', error);
    res.status(500).json({ error: 'Failed to initialize bot session' });
  }
};

export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { conversationId, message } = req.body;
    
    if (!conversationId || !message) {
      res.status(400).json({ error: 'Conversation ID and message are required' });
      return;
    }
    
    const response = await sensayService.sendMessage(
      conversationId,
      message,
      req.user._id.toString()
    );
    
    res.json({
      response: response.message,
      suggestions: response.suggestions,
      actions: response.actions
    });
  } catch (error) {
    console.error('Send message to bot error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const requestIntroduction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { targetUserId, connectionData } = req.body;
    
    if (!targetUserId) {
      res.status(400).json({ error: 'Target user ID is required' });
      return;
    }
    
    const introduction = await sensayService.generateIntroduction(
      req.user._id.toString(),
      targetUserId,
      connectionData || {}
    );
    
    res.json({
      introduction: introduction.introductionMessage,
      conversationStarters: introduction.conversationStarters,
      meetupSuggestions: introduction.meetupSuggestions
    });
  } catch (error) {
    console.error('Bot introduction error:', error);
    res.status(500).json({ error: 'Failed to generate introduction' });
  }
};

export const getSuggestions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.query;
    
    const currentEventId = (eventId as string) || req.user.currentEvent?.toString();
    if (!currentEventId) {
      res.status(400).json({ error: 'Event context required' });
      return;
    }
    
    const suggestions = await sensayService.getSuggestions(
      req.user._id.toString(),
      currentEventId
    );
    
    res.json(suggestions);
  } catch (error) {
    console.error('Get bot suggestions error:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
};

export const scheduleMeetup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { conversationId, participants, preferences } = req.body;
    
    if (!conversationId || !participants) {
      res.status(400).json({ error: 'Conversation ID and participants are required' });
      return;
    }
    
    // Ensure current user is in participants
    if (!participants.includes(req.user._id.toString())) {
      participants.push(req.user._id.toString());
    }
    
    const meetup = await sensayService.scheduleMeetup(
      conversationId,
      participants,
      preferences || {}
    );
    
    res.json({
      meetup: meetup.scheduledMeetup,
      confirmation: meetup.confirmationMessage,
      calendarInvite: meetup.calendarInvite
    });
  } catch (error) {
    console.error('Schedule meetup error:', error);
    res.status(500).json({ error: 'Failed to schedule meetup' });
  }
};

export const getConversationHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    
    if (!conversationId) {
      res.status(400).json({ error: 'Conversation ID is required' });
      return;
    }
    
    const history = await sensayService.getConversationHistory(conversationId);
    
    res.json({
      conversationId,
      messages: history,
      count: history.length
    });
  } catch (error) {
    console.error('Get conversation history error:', error);
    res.status(500).json({ error: 'Failed to get conversation history' });
  }
};