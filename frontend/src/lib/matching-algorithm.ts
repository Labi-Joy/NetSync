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

    const interests1 = user1.professionalInfo.interests ?? [];
    const interests2 = user2.professionalInfo.interests ?? [];
    const goals1 = user1.networkingProfile.goals ?? [];
    const goals2 = user2.networkingProfile.goals ?? [];

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
      user1.professionalInfo.experience &&
      user2.professionalInfo.experience &&
      this.isExperienceLevelCompatible(user1.professionalInfo.experience, user2.professionalInfo.experience)
    ) {
      score += 20;
      reasons.push("Compatible experience levels");
    }

    // Availability overlap (10% of score)
    if (this.hasAvailabilityOverlap(user1.networkingProfile.availability, user2.networkingProfile.availability)) {
      score += 10;
      reasons.push("Overlapping availability");
    }

    return {
      userId: user2._id,
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

  private hasAvailabilityOverlap(avail1: string[], avail2: string[]): boolean {
    // Basic heuristic: if both have any data, assume some overlap; if missing, be permissive
    if (!avail1 || !avail2 || avail1.length === 0 || avail2.length === 0) return true;

    // Check for overlapping availability strings
    const set1 = new Set(avail1);
    for (const time of avail2) {
      if (set1.has(time)) return true;
    }
    return false;
  }
}


