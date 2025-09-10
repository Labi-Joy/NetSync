export type UUID = string;

export interface AvailabilityPreference {
  days?: string[];
  times?: string[];
  preferences?: Record<string, unknown>;
}

export interface User {
  id: UUID;
  wallet_address?: string | null;
  email?: string | null;
  name: string;
  role?: string | null;
  company?: string | null;
  bio?: string | null;
  interests: string[];
  goals: string[];
  experience_level: "student" | "junior" | "mid" | "senior" | "founder" | string;
  availability?: AvailabilityPreference | null;
  created_at?: string;
}

export interface MatchRecord {
  id: UUID;
  user1_id: UUID;
  user2_id: UUID;
  status: "pending" | "matched" | "declined" | string;
  compatibility_score: number;
  created_at?: string;
}

export interface EventRecord {
  id: UUID;
  name: string;
  date?: string;
  location?: string;
  description?: string;
}

export interface BotConversationRecord {
  id: UUID;
  user_id: UUID;
  message: string;
  is_bot: boolean;
  created_at?: string;
}

