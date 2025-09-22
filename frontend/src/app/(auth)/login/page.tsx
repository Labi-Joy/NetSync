'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Sparkles, ArrowRight, Lock, Mail, Wallet } from 'lucide-react';
import Button from '@/components/ui/Button';
import FormField from '@/components/forms/FormField';
import Footer from '@/components/ui/Footer';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { login } = useAuth();
  const { showError, showSuccess } = useToast();
  const router = useRouter();

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fix the form errors before submitting');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
      showSuccess('Welcome back! You have been signed in successfully.');
      
      // Check for redirect parameter
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
      const redirectTo = urlParams.get('redirect');
      
      // Redirect to intended destination or dashboard
      router.push(redirectTo || '/dashboard/overview');
    } catch (err: any) {
      console.error('Login failed:', err);
      const errorMessage = err.message || 'Login failed. Please check your credentials and try again.';
      showError(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnect = () => {
    showError('Wallet connection is coming soon! Stay tuned for this feature.');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link */}
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary-600 text-white px-4 py-2 rounded-md"
      >
        Skip to login form
      </a>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Side - Animation & Content */}
        <div 
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 relative overflow-hidden"
          aria-hidden="true"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {/* Floating Network Nodes */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
            
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full">
              {[...Array(8)].map((_, i) => (
                <motion.line
                  key={i}
                  x1={`${Math.random() * 100}%`}
                  y1={`${Math.random() * 100}%`}
                  x2={`${Math.random() * 100}%`}
                  y2={`${Math.random() * 100}%`}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </svg>
            
            {/* Gradient Orbs */}
            <motion.div
              className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-3xl"
              style={{ top: '20%', left: '20%' }}
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            
            <motion.div
              className="absolute w-60 h-60 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-500/20 blur-3xl"
              style={{ bottom: '20%', right: '20%' }}
              animate={{
                scale: [1.3, 1, 1.3],
                rotate: [360, 0],
              }}
              transition={{
                duration: 20,
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
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              >
                <Shield className="w-16 h-16 mx-auto text-white/90" />
              </motion.div>
              
              <h1 className="text-4xl font-bold mb-6">
                Welcome Back to
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent block">
                  NetSync
                </span>
              </h1>
              
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Continue building meaningful professional connections and unlock new opportunities in your career journey.
              </p>
              
              {/* Feature Highlights */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {[
                  { icon: Zap, text: "Instant Smart Matching" },
                  { icon: Globe, text: "Global Network Access" },
                  { icon: Shield, text: "Secure & Private" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  >
                    <feature.icon className="w-5 h-5 text-cyan-400" />
                    <span className="text-white/90">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Stats */}
              <motion.div
                className="mt-12 grid grid-cols-3 gap-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div>
                  <div className="text-2xl font-bold text-cyan-400">10K+</div>
                  <div className="text-sm text-white/70">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">500+</div>
                  <div className="text-sm text-white/70">Events</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">95%</div>
                  <div className="text-sm text-white/70">Success Rate</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-neutral-50 dark:bg-neutral-900 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md my-auto"
          >
            <header className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl mb-4"
                role="img"
                aria-label="NetSync logo"
              >
                <Sparkles className="w-8 h-8 text-white" aria-hidden="true" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Sign in to your account to continue networking
              </p>
            </header>

            <form 
              id="login-form"
              onSubmit={handleSubmit} 
              className="space-y-6"
              noValidate
              aria-label="Sign in form"
            >
              <FormField
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(value) => updateField('email', value)}
                error={errors.email}
                required
                autoComplete="email"
                placeholder="your@email.com"
                leftIcon={<Mail className="w-5 h-5" aria-hidden="true" />}
                hint="Enter the email address associated with your account"
              />
              
              <FormField
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={(value) => updateField('password', value)}
                error={errors.password}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                leftIcon={<Lock className="w-5 h-5" aria-hidden="true" />}
                showPasswordToggle
              />
              
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.rememberMe}
                    onChange={(e) => updateField('rememberMe', e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-2 focus:ring-offset-2"
                    aria-describedby="remember-me-description"
                  />
                  <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                    Remember me
                  </span>
                  <span id="remember-me-description" className="sr-only">
                    Keep me signed in on this device
                  </span>
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
                >
                  Forgot password?
                </Link>
              </div>
              
              {errors.general && (
                <div 
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.general}
                </div>
              )}
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                loadingText="Signing in..."
                rightIcon={!loading ? <ArrowRight className="w-4 h-4" aria-hidden="true" /> : undefined}
                aria-describedby="sign-in-description"
              >
                Sign In
              </Button>
              <p id="sign-in-description" className="sr-only">
                Sign in to access your NetSync dashboard and start networking
              </p>
            </form>
            
            <div className="my-8 relative" role="separator" aria-label="Alternative sign in methods">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button
              onClick={handleWalletConnect}
              variant="outline"
              size="lg"
              fullWidth
              leftIcon={<Wallet className="w-5 h-5" aria-hidden="true" />}
              aria-describedby="wallet-connect-description"
            >
              Connect Wallet
            </Button>
            <p id="wallet-connect-description" className="sr-only">
              Sign in using your Web3 wallet (feature coming soon)
            </p>

            <footer className="mt-8 text-center">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Don't have an account?{' '}
                <Link 
                  href="/signup" 
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
                >
                  Sign up
                </Link>
              </p>
            </footer>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}