"use client";
import { useEffect, useState } from "react";
import { MatchCard } from "@/components/matching/MatchCard";
import { Footer } from "@/components/ui/Footer";

interface MatchItem {
  user: { name: string; role?: string; company?: string; interests?: string[] };
  compatibility: { score: number; reasons: string[] };
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const userId = "u1"; // demo user id

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setMatches(data.matches ?? []);
    };
    load();
  }, []);

  return (
    <div className="px-6 sm:px-10 md:px-16 py-16 relative">
      <div className="absolute inset-0 gradient-bg" />
      <div className="relative">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Your Matches</h1>
      {matches.length === 0 && (
        <div className="glass-card rounded-2xl p-6 text-slate-600">No matches yet. Try updating your profile!</div>
      )}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {matches.map((m: MatchItem, idx: number) => (
          <MatchCard
            key={idx}
            user={m.user}
            compatibility={m.compatibility}
            onConnect={() => alert(`Connected with ${m.user.name}!`)}
            onPass={() => alert(`Passed on ${m.user.name}.`)}
          />)
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
}


