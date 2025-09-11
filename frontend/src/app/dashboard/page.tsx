import { BotChat } from "@/components/bot/BotChat";
import { motion } from "framer-motion";
import { Users, Calendar, TrendingUp, Zap } from "lucide-react";

export default function DashboardPage() {
  const userId = "u1";
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text)' }}>
      <div className="px-6 sm:px-10 md:px-16 py-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            Web3 Networking Dashboard
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Your professional networking command center
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="card p-6 text-center"
              >
                <Users className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>15</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Active Matches</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="card p-6 text-center"
              >
                <Calendar className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>3</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Upcoming Meetups</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="card p-6 text-center"
              >
                <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>95%</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Success Rate</div>
              </motion.div>
            </div>

            {/* Match Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
                  AI Match Suggestions
                </h2>
              </div>
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
                  New Matches Available
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  Your top professional connections will appear here during conferences and events.
                </p>
                <button className="btn btn-primary mt-4">
                  View Matches
                </button>
              </div>
            </motion.div>

            {/* Upcoming Meetups */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
                  Scheduled Networking
                </h2>
              </div>
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
                  No Meetups Scheduled
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  Use the AI assistant to coordinate meetups and schedule networking sessions.
                </p>
                <button className="btn btn-secondary mt-4">
                  Schedule Meetup
                </button>
              </div>
            </motion.div>
          </div>

          {/* AI Chat Assistant */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1"
          >
            <BotChat userId={userId} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}


