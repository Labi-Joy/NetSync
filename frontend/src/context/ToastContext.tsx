'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer, ToastType } from '@/components/ui/Toast';

interface ToastContextType {
  toasts: ToastType[];
  showToast: (toast: Omit<ToastType, 'id'>) => string;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
  showSuccess: (title: string, message?: string, options?: Partial<ToastType>) => string;
  showError: (title: string, message?: string, options?: Partial<ToastType>) => string;
  showWarning: (title: string, message?: string, options?: Partial<ToastType>) => string;
  showInfo: (title: string, message?: string, options?: Partial<ToastType>) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export const ToastProvider = ({ children, maxToasts = 5 }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const showToast = useCallback((toast: Omit<ToastType, 'id'>) => {
    const id = generateId();
    const newToast: ToastType = {
      duration: 5000,
      ...toast,
      id,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    return id;
  }, [generateId, maxToasts]);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showSuccess = useCallback((title: string, message?: string, options?: Partial<ToastType>) => {
    return showToast({ type: 'success', title, message, ...options });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string, options?: Partial<ToastType>) => {
    return showToast({ type: 'error', title, message, ...options });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string, options?: Partial<ToastType>) => {
    return showToast({ type: 'warning', title, message, ...options });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string, options?: Partial<ToastType>) => {
    return showToast({ type: 'info', title, message, ...options });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{
      toasts,
      showToast,
      hideToast,
      hideAllToasts,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};