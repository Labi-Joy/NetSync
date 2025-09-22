import request from 'supertest';
import express from 'express';
import { describe, it, expect, beforeEach, beforeAll, afterAll } from '@jest/globals';
import { User } from '../../models/User';
import { Event } from '../../models/Event';
import { Connection } from '../../models/Connection';

// Mock Redis client
jest.mock('../../config/database', () => ({
  redisClient: {
    setEx: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(1)
  }
}));

// Create test app
const app = express();
app.use(express.json());

// Import routes
import authRoutes from '../../routes/auth';
import eventRoutes from '../../routes/events';
import networkingRoutes from '../../routes/networking';
import botRoutes from '../../routes/bot';
import { errorHandler } from '../../middleware/errorHandler';

app.use('/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/networking', networkingRoutes);
app.use('/api/bot', botRoutes);

// Add error handler
app.use(errorHandler);

describe('Demo Flow Integration Tests', () => {
  let testUser1: any;
  let testUser2: any;
  let testEvent: any;
  let authToken1: string;
  let authToken2: string;

  const user1Data = {
    email: 'demo1@netsync.com',
    password: 'DemoPass123!',
    name: 'Demo User 1',
    professionalInfo: {
      title: 'Senior Developer',
      company: 'TechCorp',
      experience: 'senior',
      skills: ['React', 'Node.js', 'TypeScript'],
      interests: ['Web3', 'DeFi', 'NFTs']
    },
    networkingProfile: {
      goals: ['Find co-founders', 'Learn new tech'],
      lookingFor: 'collaborators',
      communicationStyle: 'proactive',
      availability: ['Morning', 'Afternoon']
    }
  };

  const user2Data = {
    email: 'demo2@netsync.com',
    password: 'DemoPass123!',
    name: 'Demo User 2',
    professionalInfo: {
      title: 'Product Manager',
      company: 'StartupXYZ',
      experience: 'mid',
      skills: ['Product Strategy', 'User Research'],
      interests: ['Web3', 'Product', 'Strategy']
    },
    networkingProfile: {
      goals: ['Meet developers', 'Find mentors'],
      lookingFor: 'mentor',
      communicationStyle: 'structured',
      availability: ['Afternoon', 'Evening']
    }
  };

  beforeAll(async () => {
    // Create test event
    testEvent = new Event({
      name: 'Demo Conference 2024',
      description: 'Test conference for demo',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-03'),
      venue: {
        name: 'Demo Venue',
        address: 'Demo Address'
      },
      schedule: [{
        sessionId: 'demo-session',
        title: 'Demo Session',
        startTime: new Date('2024-12-01T10:00:00Z'),
        endTime: new Date('2024-12-01T11:00:00Z'),
        location: 'Demo Hall'
      }],
      attendees: [],
      isActive: true
    });
    await testEvent.save();
  });

  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});
  });

  describe('Complete Demo User Journey', () => {
    it('should complete full registration -> login -> event join -> matching flow', async () => {
      // Step 1: Register User 1
      const registerResponse1 = await request(app)
        .post('/auth/register')
        .send(user1Data)
        .expect(201);

      expect(registerResponse1.body.message).toBe('User registered successfully');
      expect(registerResponse1.body.tokens.accessToken).toBeDefined();
      authToken1 = registerResponse1.body.tokens.accessToken;

      // Step 2: Register User 2
      const registerResponse2 = await request(app)
        .post('/auth/register')
        .send(user2Data)
        .expect(201);

      expect(registerResponse2.body.message).toBe('User registered successfully');
      expect(registerResponse2.body.tokens.accessToken).toBeDefined();
      authToken2 = registerResponse2.body.tokens.accessToken;

      // Step 3: Both users join the event
      await request(app)
        .post(`/api/events/${testEvent._id}/join`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(200);

      await request(app)
        .post(`/api/events/${testEvent._id}/join`)
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(200);

      // Step 4: User 1 finds matches
      const matchesResponse = await request(app)
        .get('/api/networking/matches')
        .set('Authorization', `Bearer ${authToken1}`)
        .query({ eventId: testEvent._id })
        .expect(200);

      expect(matchesResponse.body.matches).toBeInstanceOf(Array);
      expect(matchesResponse.body.count).toBeGreaterThan(0);

      // Step 5: User 1 creates introduction request
      const targetUser = await User.findOne({ email: user2Data.email });
      const introResponse = await request(app)
        .post('/api/networking/introduce')
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          targetUserId: targetUser._id,
          eventId: testEvent._id
        })
        .expect(200);

      expect(introResponse.body.message).toBe('Introduction request created successfully');
      expect(introResponse.body.connection).toBeDefined();
    });

    it('should handle authentication errors gracefully', async () => {
      // Test with invalid token
      await request(app)
        .get('/api/networking/matches')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      // Test without token
      await request(app)
        .get('/api/networking/matches')
        .expect(401);
    });

    it('should prevent duplicate registrations', async () => {
      // Register user first time
      await request(app)
        .post('/auth/register')
        .send(user1Data)
        .expect(201);

      // Try to register same email again
      await request(app)
        .post('/auth/register')
        .send(user1Data)
        .expect(409);
    });

    it('should validate login credentials', async () => {
      // Register user
      await request(app)
        .post('/auth/register')
        .send(user1Data)
        .expect(201);

      // Valid login
      await request(app)
        .post('/auth/login')
        .send({
          email: user1Data.email,
          password: user1Data.password
        })
        .expect(200);

      // Invalid password
      await request(app)
        .post('/auth/login')
        .send({
          email: user1Data.email,
          password: 'wrong-password'
        })
        .expect(401);

      // Invalid email
      await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@email.com',
          password: user1Data.password
        })
        .expect(401);
    });
  });

  describe('Bot Integration Flow', () => {
    beforeEach(async () => {
      // Setup authenticated user for bot tests
      const user = new User(user1Data);
      await user.save();
      user.currentEvent = testEvent._id;
      await user.save();

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: user1Data.email,
          password: user1Data.password
        });
      authToken1 = response.body.tokens.accessToken;
    });

    it('should initialize bot session', async () => {
      const response = await request(app)
        .post('/api/bot/initialize')
        .set('Authorization', `Bearer ${authToken1}`)
        .send({ eventId: testEvent._id })
        .expect(200);

      expect(response.body.message).toBe('Bot session initialized successfully');
      expect(response.body.conversationId).toBeDefined();
      expect(response.body.welcomeMessage).toBeDefined();
    });

    it('should handle bot messages', async () => {
      // Initialize bot first
      const initResponse = await request(app)
        .post('/api/bot/initialize')
        .set('Authorization', `Bearer ${authToken1}`)
        .send({ eventId: testEvent._id })
        .expect(200);

      const conversationId = initResponse.body.conversationId;

      // Send message to bot
      const messageResponse = await request(app)
        .post('/api/bot/message')
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          conversationId,
          message: 'Hello, can you help me find connections?'
        })
        .expect(200);

      expect(messageResponse.body.response).toBeDefined();
    });
  });

  afterAll(async () => {
    // Cleanup
    await User.deleteMany({});
    await Event.deleteMany({});
    await Connection.deleteMany({});
  });
});

// Test helper functions
export const createTestUser = async (userData: any) => {
  const user = new User(userData);
  return await user.save();
};

export const createTestEvent = async () => {
  const event = new Event({
    name: 'Test Event',
    description: 'Test event for integration tests',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-03'),
    venue: {
      name: 'Test Venue',
      address: 'Test Address'
    },
    schedule: [],
    attendees: [],
    isActive: true
  });
  return await event.save();
};

export const authenticateUser = async (app: express.Express, email: string, password: string): Promise<string> => {
  const response = await request(app)
    .post('/auth/login')
    .send({ email, password })
    .expect(200);
  
  return response.body.tokens.accessToken;
};