import { User, IUserDocument } from '../models/User';
import { Connection, IConnectionDocument } from '../models/Connection';
import { Event, IEventDocument } from '../models/Event';
import { IUser, MatchingCriteria } from '../types';

export class MatchingService {
  private calculateInterestScore(user1Interests: string[], user2Interests: string[]): number {
    if (!user1Interests?.length || !user2Interests?.length) return 0;
    
    const commonInterests = user1Interests.filter(interest => 
      user2Interests.some(otherInterest => 
        otherInterest.toLowerCase() === interest.toLowerCase()
      )
    );
    
    const uniqueInterests = new Set([...user1Interests, ...user2Interests]).size;
    return uniqueInterests > 0 ? (commonInterests.length / uniqueInterests) * 40 : 0;
  }
  
  private calculateSkillScore(user1Skills: string[], user2Skills: string[]): number {
    if (!user1Skills?.length || !user2Skills?.length) return 0;
    
    const complementarySkills = user1Skills.filter(skill => 
      !user2Skills.some(otherSkill => 
        otherSkill.toLowerCase() === skill.toLowerCase()
      )
    );
    
    return (complementarySkills.length / Math.max(user1Skills.length, user2Skills.length)) * 25;
  }
  
  private calculateExperienceScore(exp1: string, exp2: string, lookingFor: string): number {
    const expLevels = { junior: 1, mid: 2, senior: 3, executive: 4 };
    const level1 = expLevels[exp1 as keyof typeof expLevels] || 2;
    const level2 = expLevels[exp2 as keyof typeof expLevels] || 2;
    
    if (lookingFor === 'mentor' && level2 > level1) return 20;
    if (lookingFor === 'mentee' && level1 > level2) return 20;
    if (lookingFor === 'peers' && Math.abs(level1 - level2) <= 1) return 15;
    if (lookingFor === 'all' || lookingFor === 'collaborators') return 10;
    
    return 0;
  }
  
  private calculateCommunicationScore(style1: string, style2: string): number {
    if (style1 === style2) return 10;
    if ((style1 === 'proactive' && style2 === 'reactive') || 
        (style1 === 'reactive' && style2 === 'proactive')) return 15;
    return 5;
  }
  
  private generateConversationStarter(user1: any, user2: any, commonInterests: string[]): string {
    if (commonInterests.length > 0) {
      return `You both share an interest in ${commonInterests[0]}. ${user1.name} works at ${user1.professionalInfo.company} as a ${user1.professionalInfo.title}, while ${user2.name} is a ${user2.professionalInfo.title} at ${user2.professionalInfo.company}.`;
    }
    
    return `${user1.name} from ${user1.professionalInfo.company} and ${user2.name} from ${user2.professionalInfo.company} both have complementary skills that could create interesting collaboration opportunities.`;
  }
  
  private generateMatchReason(score: number, user1: any, user2: any): string {
    if (score >= 80) return 'Highly compatible based on shared interests and complementary experience levels';
    if (score >= 60) return 'Good match with common professional interests and compatible communication styles';
    if (score >= 40) return 'Potential connection with complementary skills and experience';
    return 'Interesting cross-domain connection opportunity';
  }
  
  public async findMatches(userId: string, eventId: string | null, limit: number = 10): Promise<any[]> {
    try {
      const currentUser = await User.findById(userId);
      if (!currentUser) throw new Error('User not found');

      // Find potential matches based on context
      let potentialUsers: any[];

      if (eventId) {
        // Event-specific matching: find other attendees of the same event
        potentialUsers = await User.find({
          currentEvent: eventId,
          _id: { $ne: userId }
        });
      } else {
        // General networking: find all users except current user
        potentialUsers = await User.find({
          _id: { $ne: userId }
        }).limit(100); // Limit for performance
      }

      // Get existing connections to exclude them
      const connectionFilter = eventId
        ? { eventId, participants: userId }
        : { participants: userId };

      const existingConnections = await Connection.find(connectionFilter).select('participants');

      const connectedUserIds = new Set(
        existingConnections.flatMap(conn =>
          conn.participants.map(p => p.toString()).filter(id => id !== userId)
        )
      );

      const potentialMatches = potentialUsers.filter(user =>
        !connectedUserIds.has((user._id as any).toString())
      );
      
      const matches = potentialMatches.map(user => {
        const interestScore = this.calculateInterestScore(
          currentUser.professionalInfo.interests,
          user.professionalInfo.interests
        );
        
        const skillScore = this.calculateSkillScore(
          currentUser.professionalInfo.skills,
          user.professionalInfo.skills
        );
        
        const experienceScore = this.calculateExperienceScore(
          currentUser.professionalInfo.experience,
          user.professionalInfo.experience,
          currentUser.networkingProfile.lookingFor
        );
        
        const communicationScore = this.calculateCommunicationScore(
          currentUser.networkingProfile.communicationStyle,
          user.networkingProfile.communicationStyle
        );
        
        const totalScore = Math.min(100, 
          interestScore + skillScore + experienceScore + communicationScore
        );
        
        const commonInterests = currentUser.professionalInfo.interests.filter(interest =>
          user.professionalInfo.interests.some(otherInterest =>
            otherInterest.toLowerCase() === interest.toLowerCase()
          )
        );
        
        return {
          user: user.toJSON(),
          matchScore: Math.round(totalScore),
          matchReason: this.generateMatchReason(totalScore, currentUser, user),
          conversationStarter: this.generateConversationStarter(currentUser, user, commonInterests),
          breakdown: {
            interests: Math.round(interestScore),
            skills: Math.round(skillScore),
            experience: Math.round(experienceScore),
            communication: Math.round(communicationScore)
          }
        };
      });
      
      return matches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
        
    } catch (error) {
      console.error('Find matches error:', error);
      throw error;
    }
  }
  
  public async createConnection(
    eventId: string,
    user1Id: string,
    user2Id: string,
    matchData: any
  ): Promise<any> {
    try {
      const existingConnection = await Connection.findOne({
        eventId,
        participants: { $all: [user1Id, user2Id] }
      });
      
      if (existingConnection) {
        throw new Error('Connection already exists');
      }
      
      const connection = new Connection({
        eventId,
        participants: [user1Id, user2Id],
        matchScore: matchData.matchScore,
        matchReason: matchData.matchReason,
        conversationStarter: matchData.conversationStarter,
        status: 'suggested',
        suggestedMeetup: {
          time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          location: 'Main conference hall',
          duration: 30
        },
        interactions: [{
          type: 'bot_introduction',
          timestamp: new Date(),
          data: { matchScore: matchData.matchScore, reason: matchData.matchReason }
        }]
      });
      
      await connection.save();
      await connection.populate('participants', 'name email professionalInfo profilePicture');
      
      return connection;
    } catch (error) {
      console.error('Create connection error:', error);
      throw error;
    }
  }

  public async generateMatches(eventId: string): Promise<any[]> {
    try {
      const event = await Event.findById(eventId);
      if (!event) throw new Error('Event not found');

      const attendees = await User.find({
        _id: { $in: event.attendees }
      });

      const matches: any[] = [];

      // Generate all possible pairs
      for (let i = 0; i < attendees.length; i++) {
        for (let j = i + 1; j < attendees.length; j++) {
          const user1 = attendees[i];
          const user2 = attendees[j];

          // Check if connection already exists
          const existingConnection = await Connection.findOne({
            eventId,
            participants: { $all: [user1._id, user2._id] }
          });

          if (existingConnection) continue;

          const interestScore = this.calculateInterestScore(
            user1.professionalInfo.interests,
            user2.professionalInfo.interests
          );

          const skillScore = this.calculateSkillScore(
            user1.professionalInfo.skills,
            user2.professionalInfo.skills
          );

          const experienceScore = this.calculateExperienceScore(
            user1.professionalInfo.experience,
            user2.professionalInfo.experience,
            user1.networkingProfile.lookingFor
          );

          const communicationScore = this.calculateCommunicationScore(
            user1.networkingProfile.communicationStyle,
            user2.networkingProfile.communicationStyle
          );

          const totalScore = Math.min(100,
            interestScore + skillScore + experienceScore + communicationScore
          );

          const commonInterests = user1.professionalInfo.interests.filter(interest =>
            user2.professionalInfo.interests.some(otherInterest =>
              otherInterest.toLowerCase() === interest.toLowerCase()
            )
          );

          matches.push({
            participants: [user1._id, user2._id],
            matchScore: Math.round(totalScore),
            matchReason: this.generateMatchReason(totalScore, user1, user2),
            conversationStarter: this.generateConversationStarter(user1, user2, commonInterests),
            suggestedMeetup: {
              time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
              location: 'Main conference hall',
              duration: 30
            },
            breakdown: {
              interests: Math.round(interestScore),
              skills: Math.round(skillScore),
              experience: Math.round(experienceScore),
              communication: Math.round(communicationScore)
            }
          });
        }
      }

      // Sort by match score and return top matches
      return matches.sort((a, b) => b.matchScore - a.matchScore);

    } catch (error) {
      console.error('Generate matches error:', error);
      throw error;
    }
  }

  public async getMatchesForUser(userId: string, eventId: string): Promise<any[]> {
    try {
      const allMatches = await this.generateMatches(eventId);

      // Filter matches that include the specified user
      const userMatches = allMatches.filter(match =>
        match.participants.some((participantId: any) =>
          participantId.toString() === userId.toString()
        )
      );

      // Populate user information while preserving original participant IDs
      for (const match of userMatches) {
        const populatedParticipants = await User.find({
          _id: { $in: match.participants }
        }).select('name email professionalInfo profilePicture');

        // Keep original participants array and add populated data
        match.participantsData = populatedParticipants;
      }

      return userMatches;

    } catch (error) {
      console.error('Get matches for user error:', error);
      throw error;
    }
  }
}