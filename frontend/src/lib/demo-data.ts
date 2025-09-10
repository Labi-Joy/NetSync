import type { User } from "@/types";

export const demoUsers: User[] = [
  {
    id: "u1",
    name: "Alice Carter",
    role: "Frontend Engineer",
    company: "Neon Labs",
    interests: ["Web3", "Frontend", "AI"],
    goals: ["networking", "offer mentorship"],
    experience_level: "senior",
    availability: { days: ["Fri", "Sat"], times: ["PM"] },
  },
  {
    id: "u2",
    name: "Ben Kim",
    role: "Founder",
    company: "ChainForge",
    interests: ["Web3", "DeFi", "AI"],
    goals: ["find co-founder", "learning opportunities"],
    experience_level: "founder",
    availability: { days: ["Sat"], times: ["AM"] },
  },
  {
    id: "u3",
    name: "Dana Lee",
    role: "ML Engineer",
    company: "VectorAI",
    interests: ["AI", "Infra", "Frontend"],
    goals: ["seek mentorship", "networking"],
    experience_level: "mid",
    availability: { days: ["Fri"], times: ["PM"] },
  },
];


