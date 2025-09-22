'use client';

import React from 'react';
import MainNavigation from '@/components/navigation/MainNavigation';
import { useAuth } from '@/context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  title,
  description 
}) => {
  const { user } = useAuth();

  // Don't render navigation for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <main id="main-content" role="main">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <MainNavigation />
      
      <main 
        id="main-content" 
        role="main"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        aria-label={title ? `${title} page` : 'Main content'}
      >
        {(title || description) && (
          <header className="mb-8">
            {title && (
              <h1 className="text-3xl font-bold text-white mb-2">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-neutral-400 text-lg">
                {description}
              </p>
            )}
          </header>
        )}
        
        {children}
      </main>
    </div>
  );
};

export default AppLayout;