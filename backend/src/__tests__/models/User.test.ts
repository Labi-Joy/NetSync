import { User } from '../../models/User';
import { describe, it, expect } from '@jest/globals';

describe('User Model', () => {
  it('should create a user with valid data', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      professionalInfo: {
        title: 'Software Engineer',
        company: 'Tech Corp',
        experience: 'mid' as const,
        skills: ['JavaScript', 'TypeScript'],
        interests: ['Web3', 'DeFi']
      },
      networkingProfile: {
        goals: ['Learn new tech'],
        lookingFor: 'peers' as const,
        communicationStyle: 'proactive' as const,
        availability: ['Morning']
      }
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.isEmailVerified).toBe(false);
  });

  it('should hash password before saving', async () => {
    const userData = {
      email: 'hash@example.com',
      password: 'password123',
      name: 'Hash User',
      professionalInfo: {
        title: 'Engineer',
        company: 'Company',
        experience: 'junior' as const,
        skills: ['React'],
        interests: ['Web3']
      }
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.password).not.toBe(userData.password);
    expect(savedUser.password.length).toBeGreaterThan(50);
  });

  it('should compare passwords correctly', async () => {
    const password = 'testpassword123';
    const userData = {
      email: 'compare@example.com',
      password,
      name: 'Compare User',
      professionalInfo: {
        title: 'Engineer',
        company: 'Company',
        experience: 'senior' as const,
        skills: ['Node.js'],
        interests: ['Blockchain']
      }
    };

    const user = new User(userData);
    const savedUser = await user.save();

    const isMatch = await savedUser.comparePassword(password);
    expect(isMatch).toBe(true);

    const isWrongMatch = await savedUser.comparePassword('wrongpassword');
    expect(isWrongMatch).toBe(false);
  });

  it('should not include password and refreshTokens in JSON', async () => {
    const userData = {
      email: 'json@example.com',
      password: 'password123',
      name: 'JSON User',
      professionalInfo: {
        title: 'Engineer',
        company: 'Company',
        experience: 'mid' as const,
        skills: ['React'],
        interests: ['Web3']
      }
    };

    const user = new User(userData);
    const savedUser = await user.save();
    
    // Add a refresh token
    savedUser.refreshTokens.push('test-token');
    await savedUser.save();

    const userJson = savedUser.toJSON();
    expect(userJson.password).toBeUndefined();
    expect(userJson.refreshTokens).toBeUndefined();
    expect(userJson.email).toBe(userData.email);
  });

  it('should require unique email', async () => {
    const userData = {
      email: 'duplicate@example.com',
      password: 'password123',
      name: 'First User',
      professionalInfo: {
        title: 'Engineer',
        company: 'Company',
        experience: 'senior' as const,
        skills: ['React'],
        interests: ['Web3']
      }
    };

    const user1 = new User(userData);
    await user1.save();

    const user2 = new User({ ...userData, name: 'Second User' });
    
    await expect(user2.save()).rejects.toThrow();
  });
});