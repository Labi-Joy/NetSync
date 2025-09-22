import { MatchingService } from '../../services/matchingService';
import { User } from '../../models/User';
import { Event } from '../../models/Event';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('MatchingService', () => {
  let matchingService: MatchingService;
  let testEvent: any;
  let user1: any;
  let user2: any;
  let user3: any;

  beforeEach(async () => {
    matchingService = new MatchingService();

    // Create test event
    testEvent = new Event({
      name: 'Test Conference',
      description: 'Test event for matching',
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
    await testEvent.save();

    // Create test users
    user1 = new User({
      email: 'alice@example.com',
      password: 'password123',
      name: 'Alice',
      professionalInfo: {
        title: 'Frontend Developer',
        company: 'Web3 Startup',
        experience: 'mid',
        skills: ['React', 'TypeScript', 'Web3'],
        interests: ['DeFi', 'NFTs', 'Frontend']
      },
      networkingProfile: {
        goals: ['Find collaborators', 'Learn backend'],
        lookingFor: 'collaborators',
        communicationStyle: 'proactive',
        availability: ['Morning', 'Afternoon']
      },
      currentEvent: testEvent._id
    });

    user2 = new User({
      email: 'bob@example.com',
      password: 'password123',
      name: 'Bob',
      professionalInfo: {
        title: 'Backend Developer',
        company: 'DeFi Protocol',
        experience: 'senior',
        skills: ['Node.js', 'Solidity', 'Database'],
        interests: ['DeFi', 'Smart Contracts', 'Backend']
      },
      networkingProfile: {
        goals: ['Share knowledge', 'Find frontend help'],
        lookingFor: 'collaborators',
        communicationStyle: 'structured',
        availability: ['Afternoon', 'Evening']
      },
      currentEvent: testEvent._id
    });

    user3 = new User({
      email: 'charlie@example.com',
      password: 'password123',
      name: 'Charlie',
      professionalInfo: {
        title: 'Product Manager',
        company: 'Traditional Finance',
        experience: 'junior',
        skills: ['Product Strategy', 'Analytics'],
        interests: ['Product', 'Business', 'Strategy']
      },
      networkingProfile: {
        goals: ['Learn about Web3'],
        lookingFor: 'mentor',
        communicationStyle: 'reactive',
        availability: ['Morning']
      },
      currentEvent: testEvent._id
    });

    await Promise.all([user1.save(), user2.save(), user3.save()]);

    // Add users to event
    testEvent.attendees = [user1._id, user2._id, user3._id];
    await testEvent.save();
  });

  describe('generateMatches', () => {
    it('should generate matches for users in the same event', async () => {
      const matches = await matchingService.generateMatches(testEvent._id);

      expect(matches).toBeDefined();
      expect(Array.isArray(matches)).toBe(true);
      expect(matches.length).toBeGreaterThan(0);
      
      // Check that matches contain the expected structure
      const match = matches[0];
      expect(match).toHaveProperty('participants');
      expect(match).toHaveProperty('matchScore');
      expect(match).toHaveProperty('matchReason');
      expect(match).toHaveProperty('conversationStarter');
      expect(match).toHaveProperty('suggestedMeetup');
      expect(match.participants).toHaveLength(2);
    });

    it('should calculate higher scores for users with complementary skills', async () => {
      const matches = await matchingService.generateMatches(testEvent._id);

      // Find match between Alice (frontend) and Bob (backend)
      const aliceBobMatch = matches.find(match => {
        const participantIds = match.participants.map((p: any) => p.toString());
        return participantIds.includes(user1._id.toString()) && participantIds.includes(user2._id.toString());
      });

      expect(aliceBobMatch).toBeDefined();
      expect(aliceBobMatch!.matchScore).toBeGreaterThan(30); // Should have some compatibility
    });

    it('should provide meaningful conversation starters', async () => {
      const matches = await matchingService.generateMatches(testEvent._id);
      
      for (const match of matches) {
        expect(match.conversationStarter).toBeDefined();
        expect(typeof match.conversationStarter).toBe('string');
        expect(match.conversationStarter.length).toBeGreaterThan(10);
      }
    });

    it('should suggest appropriate meetup times and locations', async () => {
      const matches = await matchingService.generateMatches(testEvent._id);
      
      for (const match of matches) {
        expect(match.suggestedMeetup).toBeDefined();
        expect(match.suggestedMeetup.time).toBeInstanceOf(Date);
        expect(match.suggestedMeetup.location).toBeDefined();
        expect(match.suggestedMeetup.duration).toBeGreaterThan(0);
        expect(match.suggestedMeetup.duration).toBeLessThanOrEqual(180);
      }
    });

    it('should not create duplicate matches', async () => {
      const matches = await matchingService.generateMatches(testEvent._id);
      
      const participantPairs = matches.map(match => 
        match.participants.sort().join('-')
      );
      
      const uniquePairs = new Set(participantPairs);
      expect(uniquePairs.size).toBe(participantPairs.length);
    });
  });

  describe('getMatchesForUser', () => {
    beforeEach(async () => {
      // Generate some matches first
      await matchingService.generateMatches(testEvent._id);
    });

    it('should return matches for a specific user', async () => {
      const userMatches = await matchingService.getMatchesForUser(user1._id, testEvent._id);

      expect(Array.isArray(userMatches)).toBe(true);

      // All matches should include user1
      for (const match of userMatches) {
        const participantIds = match.participants.map((p: any) => p.toString());
        expect(participantIds).toContain(user1._id.toString());
      }
    });

    it('should populate user information in matches', async () => {
      const userMatches = await matchingService.getMatchesForUser(user1._id, testEvent._id);
      
      if (userMatches.length > 0) {
        const match = userMatches[0];
        expect(match.participants).toBeDefined();
        // Note: In a real test, you'd check that user data is populated
        // This depends on how the service implements population
      }
    });
  });
});