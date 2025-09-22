import request from 'supertest';
import express from 'express';
import { register, login } from '../../controllers/authController';
import { User } from '../../models/User';
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock Redis client
jest.mock('../../config/database', () => ({
  redisClient: {
    setEx: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(1)
  }
}));

const app = express();
app.use(express.json());
app.post('/register', register);
app.post('/login', login);

describe('Auth Controller', () => {
  const validUserData = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    professionalInfo: {
      title: 'Software Engineer',
      company: 'Tech Corp',
      experience: 'mid',
      skills: ['JavaScript', 'TypeScript'],
      interests: ['Web3', 'DeFi']
    },
    networkingProfile: {
      goals: ['Learn new tech'],
      lookingFor: 'peers',
      communicationStyle: 'proactive',
      availability: ['Morning']
    }
  };

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/register')
        .send(validUserData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Registration successful');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(validUserData.email);
      expect(response.body.user.password).toBeUndefined();
    });

    it('should not register user with existing email', async () => {
      // First registration
      await request(app)
        .post('/register')
        .send(validUserData);

      // Attempt duplicate registration
      const response = await request(app)
        .post('/register')
        .send({ ...validUserData, name: 'Another User' })
        .expect(409);

      expect(response.body).toHaveProperty('error', 'Email already registered');
    });

    it('should validate required fields', async () => {
      const incompleteData = {
        email: 'incomplete@example.com',
        password: 'password123'
        // Missing name and professionalInfo
      };

      const response = await request(app)
        .post('/register')
        .send(incompleteData)
        .expect(500); // Should fail validation

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      const user = new User(validUserData);
      await user.save();
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: validUserData.email,
          password: validUserData.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(validUserData.email);
    });

    it('should not login with invalid email', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'nonexistent@example.com',
          password: validUserData.password
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: validUserData.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should require email and password', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: validUserData.email
          // Missing password
        })
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });
});