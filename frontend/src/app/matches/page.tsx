"use client";
import { useEffect, useState } from "react";
import { MatchCard } from "@/components/matching/MatchCard";
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { motion } from "framer-motion";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { enhancedNetworkingAPI } from '@/lib/apiWithRetry';
import { UserGroupIcon, MagnifyingGlassIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface MatchItem {
  user: { id?: string; _id?: string; name: string; role?: string; company?: string; interests?: string[] };
  compatibility: { score: number; reasons: string[] };
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [skippingMatch, setSkippingMatch] = useState<string | null>(null);
  const [confirmSkip, setConfirmSkip] = useState<{ show: boolean; match?: MatchItem }>({ show: false });
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setError('Please log in to view matches');
      return;
    }

    const loadMatches = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Try to fetch matches from the backend API
        console.log('🎯 Loading matches from backend API for user:', user?._id);
        const response = await enhancedNetworkingAPI.findMatches({ 
          userId: user?._id 
        });
        console.log('✅ Matches loaded successfully:', response.data);
        setMatches(response.data.matches || []);
      } catch (err: any) {
        console.error('Failed to load matches:', err);
        
        // If API fails, provide mock data for now
        const mockMatches: MatchItem[] = [
          {
            user: {
              name: "Sarah Chen",
              role: "Senior Frontend Developer",
              company: "TechCorp",
              interests: ["React", "TypeScript", "Web3"]
            },
            compatibility: {
              score: 92,
              reasons: ["Similar tech stack", "Frontend expertise", "Interest in Web3"]
            }
          },
          {
            user: {
              name: "Alex Rodriguez", 
              role: "Product Manager",
              company: "StartupXYZ",
              interests: ["Product Strategy", "User Research", "AI/ML"]
            },
            compatibility: {
              score: 85,
              reasons: ["Complementary skills", "Similar experience level", "Interest in innovation"]
            }
          },
          {
            user: {
              name: "Maria Kim",
              role: "UX Designer",
              company: "Design Studio",
              interests: ["User Experience", "Design Systems", "Accessibility"]
            },
            compatibility: {
              score: 78,
              reasons: ["Cross-functional collaboration", "Focus on user experience", "Similar career level"]
            }
          }
        ];
        
        setMatches(mockMatches);
        setError('Using demo data - backend connection in progress');
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [isAuthenticated, user?._id]);

  const handleConnect = async (match: MatchItem) => {
    try {
      console.log('🤝 Sending connection request to:', match.user.name);
      await enhancedNetworkingAPI.requestIntroduction({
        userId: user?._id,
        targetUserId: match.user.id || match.user._id,
        message: `Hi ${match.user.name}, I'd like to connect based on our high compatibility!`
      });
      showSuccess(`Connection request sent to ${match.user.name}!`);
      console.log('✅ Connection request sent successfully');
    } catch (error: any) {
      console.error('❌ Failed to send connection request:', error);
      showError(`Could not send connection request to ${match.user.name}. Please try again.`);
    }
  };

  const handleSkipMatch = async (match: MatchItem) => {
    const matchId = match.user.id || match.user._id;
    if (!matchId) return;

    try {
      setSkippingMatch(matchId);
      console.log('👎 Passing on match:', match.user.name);
      
      await enhancedNetworkingAPI.skipMatch({ 
        userId: user?._id, 
        matchId: matchId
      });
      
      showSuccess(`You've passed on ${match.user.name}. We'll find you better matches!`);
      console.log('✅ Match passed successfully');
      
      // Remove the match from the list
      setMatches(prev => prev.filter(m => 
        (m.user.id || m.user._id) !== matchId
      ));
    } catch (error: any) {
      console.error('❌ Failed to pass match:', error);
      showError('Could not skip this match. Please try again.');
    } finally {
      setSkippingMatch(null);
      setConfirmSkip({ show: false });
    }
  };

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <EmptyState
            icon={<LockClosedIcon className="w-16 h-16" />}
            title="Authentication Required"
            description="Please log in to view your professional matches and start networking."
            actionLabel="Go to Login"
            actionHref="/login"
            variant="info"
            size="lg"
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Your Professional Matches"
      description="AI-curated connections based on your profile and interests"
    >
      {error && (
        <div 
          className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <strong>Note:</strong> {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && matches.length === 0 && !error && (
        <EmptyState
          icon={<MagnifyingGlassIcon className="w-16 h-16" />}
          title="No matches found"
          description="We couldn't find any compatible professional matches for you right now. Try updating your profile or interests to discover new networking opportunities."
          actionLabel="Update Profile"
          actionHref="/profile"
          secondaryActionLabel="Browse Events"
          secondaryActionHref="/events"
          size="lg"
        />
      )}
      
      {!loading && matches.length > 0 && (
        <>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-neutral-600 dark:text-neutral-400">
                Found <span className="font-semibold text-primary-600">{matches.length}</span> compatible professionals
              </p>
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Compatibility scores are based on your interests, skills, and career goals
            </div>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            role="feed"
            aria-label="Professional matches"
          >
            {matches.map((match: MatchItem, idx: number) => (
              <motion.div
                key={match.user.id || match.user._id || idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                role="article"
                aria-label={`Match with ${match.user.name}`}
              >
                <MatchCard
                  user={match.user}
                  compatibility={match.compatibility}
                  onConnect={() => handleConnect(match)}
                  onPass={() => setConfirmSkip({ show: true, match })}
                />
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmSkip.show}
        onClose={() => setConfirmSkip({ show: false })}
        onConfirm={() => confirmSkip.match && handleSkipMatch(confirmSkip.match)}
        title="Skip this match?"
        message={`Are you sure you want to pass on ${confirmSkip.match?.user.name}? This action cannot be undone and you won't see this profile again.`}
        confirmLabel="Skip Match"
        cancelLabel="Keep Match"
        variant="warning"
        loading={!!skippingMatch}
      />
    </AppLayout>
  );
}


