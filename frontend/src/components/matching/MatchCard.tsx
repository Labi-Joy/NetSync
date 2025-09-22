"use client";
import { motion } from "framer-motion";

interface MatchCardProps {
  user: {
    name: string;
    role?: string | null;
    company?: string | null;
    interests?: string[];
  };
  compatibility: { score: number; reasons: string[] };
  onConnect: () => void;
  onPass: () => void;
}

export function MatchCard({ user, compatibility, onConnect, onPass }: MatchCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.98, rotate: 0 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ y: -6 }}
      className="match-card p-8 relative overflow-hidden"
    >
      <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
        {compatibility.score}% Match
      </div>

      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white">
          {user.name?.[0]}
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{user.name}</h3>
        {(user.role || user.company) && (
          <p className="text-slate-600 dark:text-slate-400">
            {user.role} {user.company ? `at ${user.company}` : ""}
          </p>
        )}
      </div>

      <div className="mb-6">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Shared Interests:</p>
        <div className="flex flex-wrap gap-2">
          {(user.interests ?? []).slice(0, 3).map((interest) => (
            <span key={interest} className="interest-tag px-3 py-1 rounded-full text-sm">
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Why you should connect:</p>
        <ul className="text-sm text-slate-800 dark:text-slate-200 space-y-1">
          {compatibility.reasons.map((reason, i) => (
            <li key={i}>• {reason}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onPass}
          className="flex-1 border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:border-blue-400 hover:text-blue-700 transition-all bg-white/70"
        >
          Pass
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onConnect}
          className="flex-1 btn-primary text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all"
        >
          Connect
        </motion.button>
      </div>
    </motion.div>
  );
}


