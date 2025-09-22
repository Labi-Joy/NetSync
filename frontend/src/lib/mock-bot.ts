export class MockBot {
  private responses = {
    onboarding: [
      "Welcome to NetSync! I'm here to help you make amazing connections at your event. Let's start by completing your profile.",
      "Great! I can see you're interested in {interests}. This will help me find perfect matches for you.",
      "Perfect! With your experience in {role}, I think you'd be great for mentoring or finding collaborators.",
    ],
    matchSuggestions: [
      "I found someone perfect for you! {name} shares your interest in {shared_interests} and is looking for {goals}.",
      "This looks like a great match! You both work in {industry} and have complementary skills.",
      "I think you and {name} should connect - they're looking for exactly what you can offer!",
    ],
    meetupCoordination: [
      "I can help coordinate a meetup! Based on your schedules, {day} at {time} works best for both of you.",
      "Great match! I suggest meeting at {location} during the networking break at {time}.",
      "Perfect timing! There's a {event_session} that both of you marked as interesting. Want to attend together?",
    ],
    followUp: [
      "How did your conversation with {name} go? Should I suggest a meetup time?",
      "I see you matched with {name}! Want me to help break the ice with a conversation starter?",
      "Your networking is going great! You have {count} active conversations. Ready for more matches?",
    ],
  } as const;

  generateResponse(type: string, context: Record<string, any>): string {
    const templates = (this.responses as any)[type] || this.responses.onboarding;
    const template = templates[Math.floor(Math.random() * templates.length)];
    return this.fillTemplate(template, context);
  }

  private fillTemplate(template: string, context: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return (context as any)[key] ?? match;
    });
  }

  async getOnboardingMessage(user: any): Promise<string> {
    return this.generateResponse("onboarding", {
      interests: user?.interests?.slice(0, 2).join(" and ") || "technology",
      role: user?.role || "your field",
    });
  }

  async getMatchSuggestion(user: any, match: any, score: number): Promise<string> {
    return this.generateResponse("matchSuggestions", {
      name: match?.name ?? "someone",
      shared_interests:
        user?.interests?.find((i: string) => match?.interests?.includes(i)) ||
        "technology",
      goals: match?.goals?.[0] || "networking",
      industry: user?.company || "tech",
      score,
    });
  }
}


