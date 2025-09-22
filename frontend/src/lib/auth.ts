import type { User } from "@/types";

export type SessionUser = Pick<User, "_id" | "name" | "email">;

export const mockSessionStore: Record<string, SessionUser> = {};

export function createMockSession(user: SessionUser): string {
  const token = Math.random().toString(36).slice(2);
  mockSessionStore[token] = user;
  return token;
}

export function getMockSession(token?: string | null): SessionUser | null {
  if (!token) return null;
  return mockSessionStore[token] ?? null;
}


