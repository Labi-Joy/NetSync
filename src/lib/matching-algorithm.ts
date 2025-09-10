import type { User } from "@/types";

export interface MatchingScore {
  userId: string;
  score: number;
  reasons: string[];
}

export class MatchingEngine {
  calculateCompatibility(user1: User, user2: User): MatchingScore {
    let score = 0;
    const reasons: string[] = [];

    const interests1 = user1.interests ?? [];
    const interests2 = user2.interests ?? [];
    const goals1 = user1.goals ?? [];
    const goals2 = user2.goals ?? [];

    // Interest overlap (40% of score)
    const sharedInterests = interests1.filter((interest) =>
      interests2.includes(interest)
    );
    if (sharedInterests.length > 0 && Math.max(interests1.length, interests2.length) > 0) {
      score +=
        (sharedInterests.length /
          Math.max(interests1.length, interests2.length)) * 40;
      reasons.push(`Shared interests: ${sharedInterests.join(", ")}`);
    }

    // Complementary goals (30% of score)
    if (this.hasComplementaryGoals(goals1, goals2)) {
      score += 30;
      reasons.push("Complementary networking goals");
    }

    // Experience level compatibility (20% of score)
    if (
      user1.experience_level &&
      user2.experience_level &&
      this.isExperienceLevelCompatible(user1.experience_level, user2.experience_level)
    ) {
      score += 20;
      reasons.push("Compatible experience levels");
    }

    // Availability overlap (10% of score)
    if (this.hasAvailabilityOverlap(user1.availability, user2.availability)) {
      score += 10;
      reasons.push("Overlapping availability");
    }

    return {
      userId: user2.id,
      score: Math.round(score),
      reasons,
    };
  }

  private hasComplementaryGoals(goals1: string[], goals2: string[]): boolean {
    const mentorshipPairs: [string, string][] = [
      ["seek mentorship", "offer mentorship"],
      ["learning opportunities", "offer mentorship"],
      ["find co-founder", "co-founder"],
    ];

    return mentorshipPairs.some(
      (pair) =>
        (goals1.includes(pair[0]) && goals2.includes(pair[1])) ||
        (goals1.includes(pair[1]) && goals2.includes(pair[0]))
    );
  }

  private isExperienceLevelCompatible(level1: string, level2: string): boolean {
    const levels = ["student", "junior", "mid", "senior", "founder"];
    const index1 = levels.indexOf(level1);
    const index2 = levels.indexOf(level2);
    if (index1 === -1 || index2 === -1) return true; // be permissive with unknown labels
    return Math.abs(index1 - index2) <= 2; // Within 2 levels
  }

  private hasAvailabilityOverlap(avail1: any, avail2: any): boolean {
    // Basic heuristic: if both have any data, assume some overlap; if missing, be permissive
    if (!avail1 || !avail2) return true;
    try {
      const days1 = new Set((avail1.days ?? []) as string[]);
      const days2 = new Set((avail2.days ?? []) as string[]);
      for (const d of days1) {
        if (days2.has(d)) return true;
      }
      return false;
    } catch {
      return true;
    }
  }
}


