import { NextRequest } from "next/server";
import { MatchingEngine } from "@/lib/matching-algorithm";
import type { User } from "@/types";
import { demoUsers } from "@/lib/demo-data";

function getUserById(userId: string): User | undefined {
  return demoUsers.find((u) => u.id === userId);
}

function getAllUsers(excludeUserId?: string): User[] {
  return demoUsers.filter((u) => u.id !== excludeUserId);
}

export async function POST(request: NextRequest) {
  const { userId } = await request.json();
  const user = getUserById(userId);
  if (!user) {
    return Response.json({ matches: [] }, { status: 200 });
  }

  const allUsers = getAllUsers(userId);
  const matchingEngine = new MatchingEngine();
  const matches = allUsers
    .map((otherUser) => ({
      user: otherUser,
      compatibility: matchingEngine.calculateCompatibility(user, otherUser),
    }))
    .filter((m) => m.compatibility.score > 40)
    .sort((a, b) => b.compatibility.score - a.compatibility.score)
    .slice(0, 10);

  return Response.json({ matches });
}


