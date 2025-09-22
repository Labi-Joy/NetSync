import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { SensayService } from '../services/sensayService';

const sensayService = new SensayService();

export const initializeBot = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId, eventId, context, preferences } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Use provided userId or default to authenticated user
    const targetUserId = userId || (req.user._id as any).toString();

    // Use provided eventId or try to get from user context
    const currentEventId = eventId || req.user.currentEvent?.toString();

    // Initialize session with context
    const result = await sensayService.initializeSession(
      targetUserId,
      currentEventId || 'general', // Allow general sessions without event context
      context || 'dashboard_chat',
      preferences || {}
    );

    res.json({
      message: 'Bot session initialized successfully',
      sessionId: result.sessionId,
      conversationId: result.conversationId,
      welcomeMessage: result.welcomeMessage || 'Hello! I\'m your NetSync networking assistant. I\'m here to help you make meaningful connections and navigate networking opportunities. How can I assist you today?',
      capabilities: [
        'Find networking matches',
        'Schedule meetups',
        'Provide conversation starters',
        'Suggest networking opportunities',
        'Facilitate introductions'
      ]
    });
  } catch (error) {
    console.error('Initialize bot error:', error);
    res.status(500).json({ error: 'Failed to initialize bot session' });
  }
};

export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { conversationId, sessionId, message, context } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!conversationId && !sessionId) {
      res.status(400).json({ error: 'Either conversation ID or session ID is required' });
      return;
    }

    const response = await sensayService.sendMessage(
      conversationId || sessionId,
      message,
      (req.user._id as any).toString(),
      context
    );

    res.json({
      message: response.message,
      response: response.message, // Legacy compatibility
      suggestions: response.suggestions || [],
      actions: response.actions || [],
      conversationStarters: response.conversationStarters,
      timestamp: new Date().toISOString(),
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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
      (req.user._id as any).toString(),
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
    const { eventId, type, limit } = req.query;

    const currentEventId = (eventId as string) || req.user.currentEvent?.toString();
    const suggestionType = (type as string) || 'networking';
    const maxResults = parseInt(limit as string) || 10;

    const suggestions = await sensayService.getSuggestions(
      (req.user._id as any).toString(),
      currentEventId || 'general',
      suggestionType,
      maxResults
    );

    res.json({
      suggestions: suggestions.suggestions || [],
      opportunities: suggestions.opportunities || [],
      recommendations: suggestions.recommendations || [],
      type: suggestionType,
      eventId: currentEventId,
      timestamp: new Date().toISOString(),
      ...suggestions
    });
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
    const currentUserId = (req.user._id as any).toString();
    if (!participants.includes(currentUserId)) {
      participants.push(currentUserId);
    }

    const meetup = await sensayService.scheduleMeetup(
      conversationId,
      participants,
      preferences || {},
      currentUserId
    );

    res.json({
      success: true,
      meetup: meetup.scheduledMeetup,
      confirmation: meetup.confirmationMessage,
      calendarInvite: meetup.calendarInvite,
      participants: participants,
      scheduledBy: currentUserId,
      timestamp: new Date().toISOString()
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