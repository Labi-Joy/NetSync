export type UUID = string;

export interface AvailabilityPreference {
  days?: string[];
  times?: string[];
  preferences?: Record<string, unknown>;
}

// Updated to match backend MongoDB User model
export interface User {
  _id: string;
  email: string;
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
  currentEvent?: string;
  isEmailVerified?: boolean;
  lastActive?: string;
  created_at?: string;
}

export interface MatchRecord {
  _id: string;
  user1: string;
  user2: string;
  eventId: string;
  status: "pending" | "connected" | "declined" | "blocked";
  compatibilityScore: number;
  matchingReasons: string[];
  feedback?: {
    rating: number;
    comment?: string;
  };
  created_at?: string;
}

export interface EventRecord {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity?: number;
  attendees: string[];
  organizer: string;
  isPublic: boolean;
  tags: string[];
  sessions?: EventSession[];
  created_at?: string;
}

export interface EventSession {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  speaker?: string;
  room?: string;
  capacity?: number;
  attendees: string[];
}

export interface BotConversationRecord {
  _id: string;
  userId: string;
  eventId?: string;
  message: string;
  isBot: boolean;
  context?: {
    type: 'introduction' | 'scheduling' | 'general';
    relatedUsers?: string[];
  };
  created_at?: string;
}

