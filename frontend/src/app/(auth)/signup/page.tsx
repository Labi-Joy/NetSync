'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Zap, Target, Award, ArrowRight, Sparkles, Network } from 'lucide-react';
import Footer from '@/components/ui/Footer';
import { PasswordStrength } from '@/components/ui/PasswordStrength';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    title: '',
    company: '',
    experience: 'mid' as 'junior' | 'mid' | 'senior' | 'executive',
    skills: [''],
    interests: [''],
    goals: ['']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleArrayChange = (field: 'skills' | 'interests' | 'goals', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'skills' | 'interests' | 'goals') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'skills' | 'interests' | 'goals', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🎯 Signup form submitted with data:', formData);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        professionalInfo: {
          title: formData.title,
          company: formData.company,
          experience: formData.experience,
          skills: formData.skills.filter(skill => skill.trim() !== ''),
          interests: formData.interests.filter(interest => interest.trim() !== '')
        },
        networkingProfile: {
          goals: formData.goals.filter(goal => goal.trim() !== '')
        }
      };

      console.log('📤 Calling register with userData:', userData);
      await register(userData);
      console.log('✅ Registration successful, redirecting...');
      
      router.push('/dashboard/overview');
    } catch (err: any) {
      console.error('❌ Registration failed:', err);

      // Handle validation errors specifically
      if (err.response?.data?.details && Array.isArray(err.response.data.details)) {
        const errors = err.response.data.details.map((detail: any) =>
          `${detail.field}: ${detail.message}`
        );
        setValidationErrors(errors);
        setError('Please fix the following validation errors:');
      } else {
        setError(err.message || err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Side - Animation & Content */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  x: [-10, 10, -10],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
            
            {/* Gradient Orbs */}
            <motion.div
              className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-pink-400/30 to-purple-500/30 blur-3xl"
              style={{ top: '10%', left: '10%' }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            
            <motion.div
              className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-500/30 blur-3xl"
              style={{ bottom: '10%', right: '10%' }}
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-md"
            >
              <motion.div
                className="mb-8"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Network className="w-16 h-16 mx-auto text-white/90" />
              </motion.div>
              
              <h1 className="text-4xl font-bold mb-6">
                Join the Future of
                <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent block">
                  Professional Networking
                </span>
              </h1>
              
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Connect with like-minded professionals, discover opportunities, and grow your network with AI-powered matching.
              </p>
              
              {/* Feature Highlights */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {[
                  { icon: Zap, text: "AI-Powered Matching" },
                  { icon: Users, text: "Global Professional Network" },
                  { icon: Target, text: "Targeted Opportunities" },
                  { icon: Award, text: "Industry Recognition" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  >
                    <feature.icon className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/90">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-slate-50 dark:bg-slate-900 min-h-screen">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Create Account
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Start your networking journey today
              </p>
            </div>
            
            {(error || validationErrors.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6"
              >
                {error && <div className="font-medium mb-2">{error}</div>}
                {validationErrors.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {validationErrors.map((errorMsg, index) => (
                      <li key={index}>{errorMsg}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="At least 8 characters"
                />
                <div className="mt-3">
                  <PasswordStrength password={formData.password} showRequirements={true} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Experience Level
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                >
                  <option value="junior">Junior (0-2 years)</option>
                  <option value="mid">Mid-level (2-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                  <option value="executive">Executive/Leadership</option>
                </select>
              </div>

              {/* Skills Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Skills (At least 1 required)
                </label>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      placeholder="e.g., JavaScript, React, Project Management"
                    />
                    {formData.skills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('skills', index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('skills')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Another Skill
                </button>
              </div>

              {/* Interests Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Interests (At least 1 required)
                </label>
                {formData.interests.map((interest, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={interest}
                      onChange={(e) => handleArrayChange('interests', index, e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      placeholder="e.g., Machine Learning, Startup Funding, Design"
                    />
                    {formData.interests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('interests', index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('interests')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Another Interest
                </button>
              </div>

              {/* Goals Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Networking Goals (At least 1 required)
                </label>
                {formData.goals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => handleArrayChange('goals', index, e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      placeholder="e.g., Find a mentor, Expand professional network"
                    />
                    {formData.goals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('goals', index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('goals')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Another Goal
                </button>
              </div>
              
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                  {!loading && (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </span>
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <span className="text-slate-600 dark:text-slate-400 text-sm">
                Already have an account?{' '}
              </span>
              <Link 
                href="/login" 
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}