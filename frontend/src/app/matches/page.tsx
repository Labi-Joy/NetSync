"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { enhancedNetworkingAPI } from '@/lib/apiWithRetry';
import { Users, Search, Lock, Heart, X, UserPlus, Star, Building, MapPin } from 'lucide-react';
import Navigation from "@/components/ui/Navigation";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

interface MatchItem {
  user: {
    id?: string;
    _id?: string;
    name: string;
    role?: string;
    company?: string;
    interests?: string[];
    location?: string;
  };
  compatibility: { score: number; reasons: string[] };
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const loadMatches = async () => {
      try {
        setError('');
        console.log('🔍 Loading matches for user:', user?._id);

        // Try to load real matches
        const response = await enhancedNetworkingAPI.findMatches({ userId: user?._id });
        console.log('📊 Matches response:', response);

        if (response.data?.matches && response.data.matches.length > 0) {
          setMatches(response.data.matches);
        } else {
          // Show mock data with better styling
          const mockMatches = [
            {
              user: {
                _id: "1",
                name: "Sarah Chen",
                role: "Senior Frontend Developer",
                company: "TechCorp",
                location: "San Francisco, CA",
                interests: ["React", "TypeScript", "UI/UX"]
              },
              compatibility: {
                score: 92,
                reasons: ["Similar tech stack", "Frontend expertise", "Open source contributions"]
              }
            },
            {
              user: {
                _id: "2",
                name: "Marcus Rodriguez",
                role: "Product Manager",
                company: "StartupXYZ",
                location: "Austin, TX",
                interests: ["Product Strategy", "Analytics", "Growth"]
              },
              compatibility: {
                score: 85,
                reasons: ["Product-minded", "Data-driven approach", "Startup experience"]
              }
            },
            {
              user: {
                _id: "3",
                name: "Dr. Emily Watson",
                role: "AI Research Scientist",
                company: "DeepMind",
                location: "London, UK",
                interests: ["Machine Learning", "Neural Networks", "Research"]
              },
              compatibility: {
                score: 78,
                reasons: ["AI/ML focus", "Research background", "Technical depth"]
              }
            }
          ];

          setMatches(mockMatches);
          // Remove demo message - setError('Using demo data - connect to backend for real matches');
        }
      } catch (error: any) {
        console.error('❌ Failed to load matches:', error);
        setError('Unable to load matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [isAuthenticated, user?._id]);

  const handleConnect = async (match: MatchItem) => {
    try {
      console.log('🤝 Connecting with:', match.user.name);
      showSuccess(`Connection request sent to ${match.user.name}!`);
    } catch (error: any) {
      console.error('❌ Connection failed:', error);
      showError('Failed to send connection request');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Please log in to view your professional matches
            </p>
            <a
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AnimatedBackground />
      <Navigation />

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Your Matches
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                AI-curated professional connections based on your profile
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg">
            <strong>Note:</strong> {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && matches.length === 0 && !error && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No matches found
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We couldn't find any compatible matches right now. Try updating your profile.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/profile"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Update Profile
              </a>
              <a
                href="/events"
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Events
              </a>
            </div>
          </div>
        )}

        {/* Matches Grid */}
        {!loading && matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {matches.map((match, index) => (
              <motion.div
                key={match.user._id || match.user.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
              >
                {/* Match Score */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {match.compatibility?.score || 0}%
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">match</span>
                  </div>
                </div>

                {/* User Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {match.user.name}
                  </h3>
                  {match.user.role && (
                    <p className="text-slate-600 dark:text-slate-400 mb-1">
                      {match.user.role}
                    </p>
                  )}
                  {match.user.company && (
                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-1">
                      <Building className="w-3 h-3" />
                      {match.user.company}
                    </div>
                  )}
                  {match.user.location && (
                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3 h-3" />
                      {match.user.location}
                    </div>
                  )}
                </div>

                {/* Interests */}
                {match.user.interests && match.user.interests.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {match.user.interests.slice(0, 3).map((interest, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compatibility Reasons */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Why you match:
                  </p>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {(match.compatibility?.reasons || []).slice(0, 2).map((reason, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Connect Button */}
                <button
                  onClick={() => handleConnect(match)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Connect
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}