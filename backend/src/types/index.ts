import { ObjectId } from 'mongoose';

export interface IUser {
  _id: ObjectId;
  email: string;
  password: string;
  name: string;
  profilePicture?: string;
  professionalInfo: {
    title: string;
    company: string;
    experience: 'junior' | 'mid' | 'senior' | 'executive';
    skills: string[];
    interests: string[];
  };
  networkingProfile: {
    goals: string[];
    lookingFor: 'mentor' | 'mentee' | 'peers' | 'collaborators' | 'all';
    communicationStyle: 'proactive' | 'reactive' | 'structured';
    availability: string[];
  };
  currentEvent?: ObjectId;
  isEmailVerified: boolean;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent {
  _id: ObjectId;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venue: {
    name: string;
    address: string;
    mapData?: any;
  };
  schedule: IEventSession[];
  attendees: ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventSession {
  sessionId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  location: string;
}

export interface IConnection {
  _id: ObjectId;
  eventId: ObjectId;
  participants: [ObjectId, ObjectId];
  matchScore: number;
  matchReason: string;
  status: 'suggested' | 'introduced' | 'connected' | 'met' | 'collaborated';
  conversationStarter: string;
  suggestedMeetup: {
    time: Date;
    location: string;
    duration: number;
  };
  interactions: IInteraction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IInteraction {
  type: 'bot_introduction' | 'user_response' | 'meetup_scheduled' | 'feedback';
  timestamp: Date;
  data: any;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface SocketUser {
  userId: string;
  socketId: string;
  eventId?: string;
  status: 'online' | 'away' | 'busy';
}

export interface MatchingCriteria {
  interests: string[];
  goals: string[];
  experience: string;
  lookingFor: string;
  communicationStyle: string;
}

export interface SensayMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SensayConversation {
  conversationId: string;
  participants: ObjectId[];
  messages: SensayMessage[];
  context: any;
}