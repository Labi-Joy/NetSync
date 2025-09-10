import { NextRequest } from "next/server";
import { MockBot } from "@/lib/mock-bot";
import type { User } from "@/types";

// Mock data for MVP
const users: User[] = [
  {
    id: "u1",
    name: "Alice Carter",
    role: "Frontend Engineer",
    company: "Neon Labs",
    interests: ["Web3", "Frontend", "AI"],
    goals: ["networking", "offer mentorship"],
    experience_level: "senior",
  },
  {
    id: "u2",
    name: "Ben Kim",
    role: "Founder",
    company: "ChainForge",
    interests: ["Web3", "DeFi", "AI"],
    goals: ["find co-founder", "learning opportunities"],
    experience_level: "founder",
  },
];

function getUserById(userId: string): User | undefined {
  return users.find((u) => u.id === userId);
}

function getLatestMatch(userId: string): User | undefined {
  return users.find((u) => u.id !== userId);
}

async function saveBotConversation(_userId: string, _message: string, _isBot: boolean) {
  // no-op for mock
}

export async function POST(request: NextRequest) {
  const { userId, message, type } = await request.json();
  const bot = new MockBot();
  const user = getUserById(userId);

  let responseText = "I'm here to help you network! How can I assist you today?";
  if (type === "onboarding") {
    responseText = await bot.getOnboardingMessage(user);
  } else if (type === "match") {
    const match = getLatestMatch(userId);
    responseText = await bot.getMatchSuggestion(user, match, 85);
  }

  await saveBotConversation(userId, message, false);
  await saveBotConversation(userId, responseText, true);

  return Response.json({ response: responseText });
}


