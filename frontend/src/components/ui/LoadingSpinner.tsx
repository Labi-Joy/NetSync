'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const LoadingSpinner = ({ size = 'md', text, className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`border-2 border-purple-200 border-t-purple-600 rounded-full ${sizeClasses[size]}`}
      />
      {text && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-sm text-slate-600 dark:text-slate-400"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

const PageLoading = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

const CardLoading = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-12 w-12"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export { PageLoading, CardLoading, LoadingSpinner };
export default LoadingSpinner;