import { User } from '../models/User';
import { Connection } from '../models/Connection';
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
  
  public async findMatches(userId: string, eventId: string, limit: number = 10): Promise<any[]> {
    try {
      const currentUser = await User.findById(userId);
      if (!currentUser) throw new Error('User not found');
      
      const eventAttendees = await User.find({
        currentEvent: eventId,
        _id: { $ne: userId }
      });
      
      const existingConnections = await Connection.find({
        eventId,
        participants: userId
      }).select('participants');
      
      const connectedUserIds = new Set(
        existingConnections.flatMap(conn => 
          conn.participants.map(p => p.toString()).filter(id => id !== userId)
        )
      );
      
      const potentialMatches = eventAttendees.filter(user => 
        !connectedUserIds.has(user._id.toString())
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
}