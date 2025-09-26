"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navigation from "@/components/ui/Navigation";
import { useAuth } from '@/context/AuthContext';
import { userAPI } from "@/lib/api";
import { enhancedUserAPI } from "@/lib/apiWithRetry";

const steps = [
  "Basic Info",
  "Tech Interests", 
  "Goals",
  "Experience Level",
  "Availability",
] as const;

export default function ProfileOnboarding() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [networkingStyle, setNetworkingStyle] = useState<{style: string} | null>(null);
  const { updateProfile, user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Form data state
  const [formData, setFormData] = useState({
    // Basic Info
    fullName: user?.name || '',
    currentRole: user?.professionalInfo?.title || '',
    company: user?.professionalInfo?.company || '',
    
    // Tech Interests  
    techInterests: (user?.professionalInfo?.interests || []) as string[],
    
    // Goals
    networkingGoals: (user?.networkingProfile?.goals || []) as string[],
    
    // Experience Level
    experienceLevel: user?.professionalInfo?.experience || '',
    
    // Availability
    preferredDays: (user?.networkingProfile?.availability || []) as string[],
    preferredTimes: [] as string[],
    communicationStyle: user?.networkingProfile?.communicationStyle || 'structured',
  });

  // Load networking style and detect if this is a new user
  useEffect(() => {
    const loadNetworkingData = async () => {
      if (isAuthenticated && user) {
        try {
          // Check if user has completed profile (basic heuristic)
          const isProfileIncomplete = !user.professionalInfo?.title || 
                                    !user.professionalInfo?.company ||
                                    !user.networkingProfile?.goals?.length;
          setIsNewUser(isProfileIncomplete);

          // Load networking style preferences
          const styleResponse = await enhancedUserAPI.getNetworkingStyle();
          setNetworkingStyle(styleResponse.data);
        } catch (error) {
          console.log('Could not load networking style:', error);
        }
      }
    };

    loadNetworkingData();
  }, [isAuthenticated, user]);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => {
      const currentValue = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: currentValue.includes(value)
          ? currentValue.filter((item: string) => item !== value)
          : [...currentValue, value]
      };
    });
  };

  const handleComplete = async () => {
    if (!isAuthenticated) {
      setError('Please log in to complete your profile');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const profileData = {
        name: formData.fullName,
        professionalInfo: {
          title: formData.currentRole,
          company: formData.company,
          experience: formData.experienceLevel,
          skills: [], // Can be expanded later
          interests: formData.techInterests,
        },
        networkingProfile: {
          goals: formData.networkingGoals,
          lookingFor: 'all' as const, // Default value
          communicationStyle: formData.communicationStyle,
          availability: [...formData.preferredDays, ...formData.preferredTimes],
        }
      };

      // Use completeOnboarding API for new users, updateProfile for existing users
      if (isNewUser) {
        console.log('🎯 Completing onboarding for new user');
        await enhancedUserAPI.completeOnboarding(profileData);
        // Refresh user data after onboarding
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      } else {
        console.log('🔄 Updating profile for existing user');
        await updateProfile(profileData);
      }
      
      // Redirect to dashboard on success
      router.push('/dashboard/overview');
    } catch (err: any) {
      console.error('Profile update failed:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Redirect unauthenticated users to home page
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Will redirect, so don't render anything
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navigation />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Complete Your Profile
            </h1>
            <p className="text-blue-100 text-lg">
              {steps[step]} • Step {step + 1} of {steps.length}
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto mt-6">
              <div className="bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {isNewUser && (
              <span className="inline-block mt-4 px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                New User
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Networking Style Display */}
        {networkingStyle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Networking Style Identified</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Your style: <span className="text-green-600 dark:text-green-400 font-medium">{networkingStyle.style}</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">!</span>
              </div>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Form Container */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8"
        >
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-400">
                  Full Name
                </label>
                <input 
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-400 dark:hover:border-slate-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-400">
                    Current Role
                  </label>
                  <input 
                    value={formData.currentRole}
                    onChange={(e) => handleInputChange('currentRole', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-400 dark:hover:border-slate-500"
                    placeholder="e.g. Frontend Developer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-400">
                    Company
                  </label>
                  <input 
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-400 dark:hover:border-slate-500"
                    placeholder="e.g. Acme Corp"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-6 text-lg text-slate-900 dark:text-white">
                Select your technical interests
              </p>
              <div className="flex flex-wrap gap-3">
                {["AI/ML", "Frontend", "Backend", "Web3", "DeFi", "DevOps", "Mobile", "DevRel", "Design", "Security"].map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleArrayToggle('techInterests', interest)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all border ${
                      formData.techInterests.includes(interest)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md hover:shadow-lg'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="mb-6 text-lg text-slate-900 dark:text-white">
                What are your networking goals?
              </p>
              <div className="flex flex-wrap gap-3">
                {["General Networking", "Seek Mentorship", "Offer Mentorship", "Find Co-founder", "Learning Opportunities", "Job Opportunities", "Investment/Funding"].map((goal) => (
                  <button 
                    key={goal} 
                    onClick={() => handleArrayToggle('networkingGoals', goal)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all border ${
                      formData.networkingGoals.includes(goal) 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md hover:shadow-lg'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="mb-6 text-lg text-slate-900 dark:text-white">
                What's your experience level?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { value: "student", label: "Student" },
                  { value: "junior", label: "Junior (0-2 years)" },
                  { value: "mid", label: "Mid-level (3-5 years)" },
                  { value: "senior", label: "Senior (6+ years)" },
                  { value: "lead", label: "Tech Lead" },
                  { value: "executive", label: "Founder/CEO" }
                ].map((level) => (
                  <button 
                    key={level.value}
                    onClick={() => handleInputChange('experienceLevel', level.value)}
                    className={`btn p-4 text-center transition-colors ${
                      formData.experienceLevel === level.value 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md hover:shadow-lg'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="mb-6 text-lg text-slate-900 dark:text-white">
                When are you available for networking?
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
                  <p className="font-semibold mb-4 text-slate-900 dark:text-white">
                    Preferred Days
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <button
                        key={day}
                        onClick={() => handleArrayToggle('preferredDays', day)}
                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all border ${
                          formData.preferredDays.includes(day)
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md hover:shadow-lg'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
                  <p className="font-semibold mb-4 text-slate-900 dark:text-white">
                    Preferred Times
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Morning", "Afternoon", "Evening", "Flexible"].map((time) => (
                      <button
                        key={time}
                        onClick={() => handleArrayToggle('preferredTimes', time)}
                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all border ${
                          formData.preferredTimes.includes(time)
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md hover:shadow-lg'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-6">
          <button
            onClick={back}
            disabled={step === 0}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              step === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-700 text-slate-500'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
            }`}
          >
            ← Back
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={next}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="32" strokeDashoffset="32">
                      <animate attributeName="strokeDashoffset" values="32;0" dur="1s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  Saving...
                </span>
              ) : (
                '✓ Complete Profile'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


