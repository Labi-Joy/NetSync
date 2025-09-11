"use client";
import { useEffect, useState } from "react";
import { MatchCard } from "@/components/matching/MatchCard";
import { motion } from "framer-motion";

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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text)' }}>
      <div className="px-6 sm:px-10 md:px-16 py-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text)' }}>
            Your Professional Matches
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Discover tech professionals with high compatibility scores
          </p>
        </motion.div>

        {matches.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8 text-center"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
              No matches yet
            </h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Try updating your profile to find better networking opportunities!
            </p>
          </motion.div>
        )}
        
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {matches.map((m: MatchItem, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <MatchCard
                user={m.user}
                compatibility={m.compatibility}
                onConnect={() => alert(`Connected with ${m.user.name}!`)}
                onPass={() => alert(`Passed on ${m.user.name}.`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


