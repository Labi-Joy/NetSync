import type { User } from "@/types";

export const demoUsers: User[] = [
  {
    _id: "u1",
    email: "alice.carter@neonlabs.com",
    name: "Alice Carter",
    professionalInfo: {
      title: "Frontend Engineer",
      company: "Neon Labs",
      experience: "senior",
      skills: ["React", "TypeScript", "Web3"],
      interests: ["Web3", "Frontend", "AI"],
    },
    networkingProfile: {
      goals: ["networking", "offer mentorship"],
      lookingFor: "mentee",
      communicationStyle: "proactive",
      availability: ["Friday PM", "Saturday PM"],
    },
  },
  {
    _id: "u2",
    email: "ben.kim@chainforge.io",
    name: "Ben Kim",
    professionalInfo: {
      title: "Founder",
      company: "ChainForge",
      experience: "executive",
      skills: ["Leadership", "DeFi", "Strategy"],
      interests: ["Web3", "DeFi", "AI"],
    },
    networkingProfile: {
      goals: ["find co-founder", "learning opportunities"],
      lookingFor: "collaborators",
      communicationStyle: "structured",
      availability: ["Saturday AM"],
    },
  },
  {
    _id: "u3",
    email: "dana.lee@vectorai.com",
    name: "Dana Lee",
    professionalInfo: {
      title: "ML Engineer",
      company: "VectorAI",
      experience: "mid",
      skills: ["Python", "TensorFlow", "MLOps"],
      interests: ["AI", "Infra", "Frontend"],
    },
    networkingProfile: {
      goals: ["seek mentorship", "networking"],
      lookingFor: "mentor",
      communicationStyle: "reactive",
      availability: ["Friday PM"],
    },
  },
];


