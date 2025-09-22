'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastType {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const Toast = ({ toast, onRemove }: ToastProps) => {
  const { id, type, title, message, duration = 5000, action, persistent } = toast;

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onRemove, persistent]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getProgressBarColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-400';
      case 'error':
        return 'bg-red-400';
      case 'warning':
        return 'bg-yellow-400';
      case 'info':
        return 'bg-blue-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border ${getStyles()}`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {title}
            </p>
            {message && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {message}
              </p>
            )}
            {action && (
              <div className="mt-3">
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-l border-slate-200 dark:border-slate-700">
        <button
          onClick={() => onRemove(id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar for timed toasts */}
      {!persistent && duration > 0 && (
        <motion.div
          className={`h-1 ${getProgressBarColor()}`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onRemove={onRemove} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Toast;