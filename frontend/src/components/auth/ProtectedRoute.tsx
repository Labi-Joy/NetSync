'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfileComplete?: boolean;
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireProfileComplete = false,
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Preserve current path for redirect after login
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
        const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
        router.push(loginUrl);
        return;
      }

      // Check if profile completion is required
      if (requireProfileComplete && user) {
        const hasBasicProfile = user.name && user.professionalInfo?.title && user.professionalInfo?.company;
        if (!hasBasicProfile) {
          router.push('/profile?complete=true');
          return;
        }
      }
    }
  }, [isAuthenticated, loading, user, requireProfileComplete, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-900 dark:text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated (redirect is happening)
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if profile completion is required but not completed
  if (requireProfileComplete && user) {
    const hasBasicProfile = user.name && user.professionalInfo?.title && user.professionalInfo?.company;
    if (!hasBasicProfile) {
      return null;
    }
  }

  return <>{children}</>;
}