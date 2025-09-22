'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md mx-auto text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center"
          >
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-4">
              Something went wrong!
            </h1>
            <p className="text-slate-300 text-lg mb-4">
              We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
            </p>
            
            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 p-4 bg-slate-800 rounded-lg text-left">
                <summary className="cursor-pointer text-slate-400 hover:text-white">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-red-400 overflow-auto">
                  {error.message}
                  {error.digest && (
                    <div className="mt-2">
                      <strong>Error ID:</strong> {error.digest}
                    </div>
                  )}
                </pre>
              </details>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </button>
              
              <Link
                href="/dashboard/overview"
                className="inline-flex items-center justify-center px-6 py-3 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-all duration-200"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Link>
            </div>

            {/* Help Link */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <p className="text-slate-400 text-sm mb-2">
                Still having issues?
              </p>
              <Link
                href="/help"
                className="text-blue-400 hover:text-blue-300 transition-colors underline"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}