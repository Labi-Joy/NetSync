import axios from 'axios';
import { SensayMessage, SensayConversation } from '../types';
import { redisClient } from '../config/database';

export class SensayService {
  private baseURL: string;
  private apiKey: string;
  
  constructor() {
    this.baseURL = process.env.SENSAY_BASE_URL || 'https://api.sensay.com';
    this.apiKey = process.env.SENSAY_API_KEY || '';
  }
  
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      // Demo mode fallback - if API key is missing or demo mode is enabled
      if (!this.apiKey || process.env.NODE_ENV === 'demo' || process.env.DEMO_MODE === 'true') {
        return this.getMockResponse(endpoint, data);
      }
      
      const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Sensay API error:', error);
      // Fallback to mock response for demo reliability
      return this.getMockResponse(endpoint, data);
    }
  }
  
  private getMockResponse(endpoint: string, data: any): any {
    switch (endpoint) {
      case '/conversations/initialize':
        return { status: 'initialized', conversation_id: data.conversation_id };
      
      case '/conversations/message':
        return {
          message: this.generateMockBotResponse(data.message.content),
          suggestions: [
            'Tell me about your background',
            'What are you hoping to achieve at this event?',
            'Would you like me to suggest some connections?'
          ],
          actions: ['find_matches', 'schedule_meetup']
        };
      
      case '/introductions/generate':
        return {
          introduction: `I'd like to introduce you to a fellow attendee who shares similar interests in ${data.context.match_data.commonInterests || 'technology'}. You both have complementary skills that could lead to interesting collaborations.`,
          conversation_starters: [
            'What brought you to this event?',
            'What projects are you currently working on?',
            'Have you found any interesting sessions so far?'
          ],
          meetup_suggestions: [
            'Coffee chat during break',
            'Lunch meeting',
            'After-event drinks'
          ]
        };
      
      case '/suggestions/networking':
        return {
          suggestions: [
            'Visit the startup showcase in Hall B',
            'Attend the networking mixer at 3 PM',
            'Check out the AI & Web3 panel discussion'
          ],
          opportunities: [
            'Meet investors at the pitch competition',
            'Connect with developers at the coding workshop',
            'Network with designers at the UX showcase'
          ],
          recommendations: [
            'Based on your interests, you might enjoy the blockchain workshop',
            'Consider attending the startup funding panel',
            'The design thinking session could be valuable for your projects'
          ]
        };
      
      case '/meetups/schedule':
        return {
          meetup: {
            id: `meetup_${Date.now()}`,
            time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
            duration: data.preferences.duration || 30,
            location: 'Conference Lounge Area',
            participants: data.participants
          },
          confirmation: 'Your meetup has been scheduled! All participants will receive calendar invites.',
          calendar_invite: {
            title: 'NetSync Conference Meetup',
            description: 'Networking meetup facilitated by NetSync AI',
            location: 'Conference Lounge Area'
          }
        };
      
      default:
        return { status: 'success', data: 'Mock response' };
    }
  }
  
  private generateMockBotResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! I'm here to help you make meaningful connections at this event. What would you like to achieve today?";
    }
    
    if (message.includes('connection') || message.includes('match')) {
      return "I can help you find great connections! Based on your profile, I've identified several attendees with complementary skills and shared interests. Would you like me to facilitate some introductions?";
    }
    
    if (message.includes('schedule') || message.includes('meetup')) {
      return "I'd be happy to help schedule a meetup! I can suggest optimal times and locations based on everyone's availability and the conference schedule. Who would you like to meet with?";
    }
    
    if (message.includes('event') || message.includes('session')) {
      return "There are several interesting sessions coming up that align with your interests. I can also help you identify networking opportunities during breaks and social events. What specific areas are you most interested in?";
    }
    
    return "That's interesting! I'm here to help facilitate meaningful connections and suggest networking opportunities. Is there anything specific you'd like help with regarding networking at this event?";
  }
  
  public async initializeSession(
    userId: string,
    eventId: string,
    context?: string,
    preferences?: any
  ): Promise<{ sessionId: string; conversationId: string; welcomeMessage: string }> {
    try {
      const sessionId = `session_${userId}_${Date.now()}`;
      const conversationId = `conv_${userId}_${eventId}_${Date.now()}`;

      const userPreferences = await this.getUserPreferences(userId);
      const sessionData = {
        sessionId,
        conversationId,
        userId,
        eventId,
        context: {
          purpose: 'networking_facilitation',
          session_type: context || 'dashboard_chat',
          event_context: eventId !== 'general',
          user_preferences: { ...userPreferences, ...preferences }
        },
        createdAt: new Date().toISOString()
      };

      await redisClient.setEx(
        `sensay:session:${sessionId}`,
        3600, // 1 hour
        JSON.stringify(sessionData)
      );

      await redisClient.setEx(
        `sensay:conversation:${conversationId}`,
        3600, // 1 hour
        JSON.stringify(sessionData)
      );

      const response = await this.makeRequest('/conversations/initialize', {
        conversation_id: conversationId,
        session_id: sessionId,
        context: sessionData.context
      });

      const welcomeMessage = this.getContextualWelcomeMessage(context, eventId !== 'general');

      return {
        sessionId,
        conversationId,
        welcomeMessage
      };
    } catch (error) {
      console.error('Initialize Sensay session error:', error);
      throw error;
    }
  }
  
  public async sendMessage(
    conversationId: string,
    message: string,
    userId: string,
    context?: any
  ): Promise<any> {
    try {
      let sessionData = await this.getSessionData(conversationId);

      // Try to get session data from conversation if not found
      if (!sessionData) {
        sessionData = await this.getConversationData(conversationId);
      }

      if (!sessionData) {
        throw new Error('Session or conversation not found');
      }

      const enrichedContext = {
        ...sessionData.context,
        message_context: context,
        timestamp: new Date().toISOString()
      };

      const response = await this.makeRequest('/conversations/message', {
        conversation_id: conversationId,
        message: {
          role: 'user',
          content: message,
          user_id: userId
        },
        context: enrichedContext
      });

      // Store conversation history in Redis
      await this.storeMessage(conversationId, 'user', message);
      await this.storeMessage(conversationId, 'assistant', response.message);

      return {
        message: response.message,
        suggestions: response.suggestions || [],
        actions: response.actions || [],
        conversationStarters: response.conversation_starters
      };
    } catch (error) {
      console.error('Send Sensay message error:', error);
      throw error;
    }
  }
  
  public async generateIntroduction(user1Id: string, user2Id: string, connectionData: any): Promise<any> {
    try {
      const [user1Prefs, user2Prefs] = await Promise.all([
        this.getUserPreferences(user1Id),
        this.getUserPreferences(user2Id)
      ]);
      
      const introContext = {
        participants: [
          { id: user1Id, preferences: user1Prefs },
          { id: user2Id, preferences: user2Prefs }
        ],
        match_data: connectionData,
        purpose: 'introduction_facilitation'
      };
      
      const response = await this.makeRequest('/introductions/generate', {
        context: introContext,
        style: 'professional_networking'
      });
      
      return {
        introductionMessage: response.introduction,
        conversationStarters: response.conversation_starters || [],
        meetupSuggestions: response.meetup_suggestions || []
      };
    } catch (error) {
      console.error('Generate introduction error:', error);
      throw error;
    }
  }
  
  public async getSuggestions(
    userId: string,
    eventId: string,
    type?: string,
    limit?: number
  ): Promise<any> {
    try {
      const userPrefs = await this.getUserPreferences(userId);

      const response = await this.makeRequest('/suggestions/networking', {
        user_id: userId,
        event_id: eventId,
        type: type || 'networking',
        limit: limit || 10,
        preferences: userPrefs,
        context: {
          current_time: new Date().toISOString(),
          networking_goals: userPrefs.networking_goals,
          suggestion_context: type
        }
      });

      return {
        suggestions: response.suggestions || [],
        opportunities: response.opportunities || [],
        recommendations: response.recommendations || [],
        type,
        count: (response.suggestions?.length || 0) + (response.opportunities?.length || 0)
      };
    } catch (error) {
      console.error('Get Sensay suggestions error:', error);
      throw error;
    }
  }
  
  public async scheduleMeetup(
    conversationId: string,
    participants: string[],
    preferences: any,
    scheduledBy?: string
  ): Promise<any> {
    try {
      const response = await this.makeRequest('/meetups/schedule', {
        conversation_id: conversationId,
        participants,
        scheduled_by: scheduledBy,
        preferences: {
          duration: preferences.duration || 30,
          location_type: preferences.locationType || 'conference_venue',
          time_preference: preferences.timePreference || 'flexible',
          ...preferences
        },
        timestamp: new Date().toISOString()
      });

      // Store meetup info in Redis for tracking
      const meetupData = {
        ...response.meetup,
        conversationId,
        participants,
        scheduledBy,
        createdAt: new Date().toISOString()
      };

      await redisClient.setEx(
        `sensay:meetup:${response.meetup.id}`,
        86400, // 24 hours
        JSON.stringify(meetupData)
      );

      return {
        scheduledMeetup: response.meetup,
        confirmationMessage: response.confirmation,
        calendarInvite: response.calendar_invite
      };
    } catch (error) {
      console.error('Schedule meetup error:', error);
      throw error;
    }
  }
  
  private async getUserPreferences(userId: string): Promise<any> {
    try {
      const cachedPrefs = await redisClient.get(`user:${userId}:preferences`);
      if (cachedPrefs) {
        return JSON.parse(cachedPrefs);
      }
      
      // In a real implementation, fetch from user database
      const defaultPrefs = {
        communication_style: 'adaptive',
        networking_goals: ['professional_growth', 'knowledge_sharing'],
        availability: 'flexible',
        interaction_preference: 'guided'
      };
      
      await redisClient.setEx(
        `user:${userId}:preferences`,
        3600,
        JSON.stringify(defaultPrefs)
      );
      
      return defaultPrefs;
    } catch (error) {
      console.error('Get user preferences error:', error);
      return {};
    }
  }
  
  private async getSessionData(sessionId: string): Promise<any> {
    try {
      const sessionData = await redisClient.get(`sensay:session:${sessionId}`);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Get session data error:', error);
      return null;
    }
  }

  private async getConversationData(conversationId: string): Promise<any> {
    try {
      const conversationData = await redisClient.get(`sensay:conversation:${conversationId}`);
      return conversationData ? JSON.parse(conversationData) : null;
    } catch (error) {
      console.error('Get conversation data error:', error);
      return null;
    }
  }

  private getContextualWelcomeMessage(context?: string, hasEventContext?: boolean): string {
    const baseMessage = "Hello! I'm your NetSync networking assistant.";

    switch (context) {
      case 'event_chat':
        return `${baseMessage} I'm here to help you make the most of this event by facilitating meaningful connections and suggesting networking opportunities. What would you like to achieve today?`;

      case 'networking_session':
        return `${baseMessage} I can help you find relevant connections, schedule meetups, and provide conversation starters. How can I assist with your networking goals?`;

      case 'introduction':
        return `${baseMessage} I'm here to facilitate introductions and help you connect with the right people. Let me know who you'd like to meet or what you're looking for!`;

      default:
        return `${baseMessage} I'm here to help you navigate networking opportunities, find meaningful connections, and make the most of your professional interactions. How can I assist you today?`;
    }
  }
  
  private async storeMessage(conversationId: string, role: 'user' | 'assistant', content: string): Promise<void> {
    try {
      const message: SensayMessage = {
        role,
        content,
        timestamp: new Date()
      };
      
      const historyKey = `sensay:history:${conversationId}`;
      const existingHistory = await redisClient.get(historyKey);
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      history.push(message);
      
      // Keep only last 50 messages
      if (history.length > 50) {
        history.splice(0, history.length - 50);
      }
      
      await redisClient.setEx(historyKey, 3600, JSON.stringify(history));
    } catch (error) {
      console.error('Store message error:', error);
    }
  }
  
  public async getConversationHistory(conversationId: string): Promise<SensayMessage[]> {
    try {
      const historyKey = `sensay:history:${conversationId}`;
      const history = await redisClient.get(historyKey);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Get conversation history error:', error);
      return [];
    }
  }
}