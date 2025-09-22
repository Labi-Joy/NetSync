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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 text-center max-w-md"
        >
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
            Authentication Required
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Please log in to complete your profile
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navigation />
      <div className="px-6 sm:px-10 md:px-16 py-16 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
            Complete Your Profile
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-slate-600 dark:text-slate-400">
              Step {step + 1} of {steps.length}: {steps[step]}
              {isNewUser && <span className="ml-2 px-2 py-1 text-xs rounded bg-purple-600 text-white">New User</span>}
            </p>
            <div className="flex gap-1">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx <= step ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                  style={{ 
                    backgroundColor: idx <= step ? '#8b5cf6' : '#64748b' 
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Networking Style Display */}
          {networkingStyle && (
            <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your networking style: <span className="text-purple-600 dark:text-purple-400">{networkingStyle.style}</span>
              </p>
            </div>
          )}
          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </motion.div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-8 mb-8"
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
                  className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
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
                    className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
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
                    className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
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
                    className={`btn text-sm transition-colors ${
                      formData.techInterests.includes(interest) 
                        ? 'btn-primary' 
                        : 'btn-outline'
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
                    className={`btn text-sm transition-colors ${
                      formData.networkingGoals.includes(goal) 
                        ? 'btn-primary' 
                        : 'btn-outline'
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
                        ? 'btn-primary' 
                        : 'btn-outline'
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
                <div className="card p-6">
                  <p className="font-semibold mb-4 text-slate-900 dark:text-white">
                    Preferred Days
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <button 
                        key={day} 
                        onClick={() => handleArrayToggle('preferredDays', day)}
                        className={`btn text-sm transition-colors ${
                          formData.preferredDays.includes(day) 
                            ? 'btn-primary' 
                            : 'btn-outline'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="card p-6">
                  <p className="font-semibold mb-4 text-slate-900 dark:text-white">
                    Preferred Times
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Morning", "Afternoon", "Evening", "Flexible"].map((time) => (
                      <button 
                        key={time} 
                        onClick={() => handleArrayToggle('preferredTimes', time)}
                        className={`btn text-sm transition-colors ${
                          formData.preferredTimes.includes(time) 
                            ? 'btn-primary' 
                            : 'btn-outline'
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

        <div className="flex justify-between items-center">
          <button 
            onClick={back} 
            className="btn btn-secondary"
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.5 : 1 }}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button onClick={next} className="btn btn-primary">
              Next Step
            </button>
          ) : (
            <button 
              onClick={handleComplete}
              disabled={loading}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


