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
      const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Sensay API error:', error);
      throw new Error('Sensay API request failed');
    }
  }
  
  public async initializeSession(userId: string, eventId: string): Promise<string> {
    try {
      const conversationId = `conv_${userId}_${eventId}_${Date.now()}`;
      
      const sessionData = {
        conversationId,
        userId,
        eventId,
        context: {
          purpose: 'networking_facilitation',
          event_context: true,
          user_preferences: await this.getUserPreferences(userId)
        }
      };
      
      await redisClient.setEx(
        `sensay:session:${conversationId}`,
        3600, // 1 hour
        JSON.stringify(sessionData)
      );
      
      const response = await this.makeRequest('/conversations/initialize', {
        conversation_id: conversationId,
        context: sessionData.context
      });
      
      return conversationId;
    } catch (error) {
      console.error('Initialize Sensay session error:', error);
      throw error;
    }
  }
  
  public async sendMessage(conversationId: string, message: string, userId: string): Promise<any> {
    try {
      const sessionData = await this.getSessionData(conversationId);
      if (!sessionData) {
        throw new Error('Session not found');
      }
      
      const response = await this.makeRequest('/conversations/message', {
        conversation_id: conversationId,
        message: {
          role: 'user',
          content: message,
          user_id: userId
        },
        context: sessionData.context
      });
      
      // Store conversation history in Redis
      await this.storeMessage(conversationId, 'user', message);
      await this.storeMessage(conversationId, 'assistant', response.message);
      
      return {
        message: response.message,
        suggestions: response.suggestions || [],
        actions: response.actions || []
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
  
  public async getSuggestions(userId: string, eventId: string): Promise<any> {
    try {
      const userPrefs = await this.getUserPreferences(userId);
      
      const response = await this.makeRequest('/suggestions/networking', {
        user_id: userId,
        event_id: eventId,
        preferences: userPrefs,
        context: {
          current_time: new Date().toISOString(),
          networking_goals: userPrefs.networking_goals
        }
      });
      
      return {
        suggestions: response.suggestions || [],
        opportunities: response.opportunities || [],
        recommendations: response.recommendations || []
      };
    } catch (error) {
      console.error('Get Sensay suggestions error:', error);
      throw error;
    }
  }
  
  public async scheduleMeetup(
    conversationId: string,
    participants: string[],
    preferences: any
  ): Promise<any> {
    try {
      const response = await this.makeRequest('/meetups/schedule', {
        conversation_id: conversationId,
        participants,
        preferences: {
          duration: preferences.duration || 30,
          location_type: preferences.locationType || 'conference_venue',
          time_preference: preferences.timePreference || 'flexible'
        }
      });
      
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
  
  private async getSessionData(conversationId: string): Promise<any> {
    try {
      const sessionData = await redisClient.get(`sensay:session:${conversationId}`);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Get session data error:', error);
      return null;
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