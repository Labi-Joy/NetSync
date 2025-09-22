'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-neutral-200 dark:bg-neutral-700';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  };

  const getStyle = () => {
    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    return style;
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2" role="status" aria-label="Loading content">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{
              ...getStyle(),
              width: index === lines - 1 ? '75%' : '100%', // Last line is shorter
            }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={getStyle()}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Pre-built skeleton components for common use cases
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`card p-6 ${className}`} role="status" aria-label="Loading card">
    <div className="space-y-4">
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" lines={3} />
      <div className="flex space-x-2">
        <Skeleton variant="rounded" width={80} height={32} />
        <Skeleton variant="rounded" width={100} height={32} />
      </div>
    </div>
    <span className="sr-only">Loading card content...</span>
  </div>
);

export const SkeletonProfile: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center space-x-4 ${className}`} role="status" aria-label="Loading profile">
    <Skeleton variant="circular" width={64} height={64} />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </div>
    <span className="sr-only">Loading profile...</span>
  </div>
);

export const SkeletonList: React.FC<{ 
  items?: number; 
  showAvatar?: boolean; 
  className?: string;
}> = ({ 
  items = 3, 
  showAvatar = false, 
  className = '' 
}) => (
  <div className={`space-y-4 ${className}`} role="status" aria-label="Loading list">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4">
        {showAvatar && <Skeleton variant="circular" width={40} height={40} />}
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
    ))}
    <span className="sr-only">Loading list items...</span>
  </div>
);

export const SkeletonTable: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string;
}> = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}) => (
  <div className={`space-y-2 ${className}`} role="status" aria-label="Loading table">
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={`header-${index}`} variant="text" height={20} />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div 
        key={`row-${rowIndex}`} 
        className="grid gap-4" 
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" />
        ))}
      </div>
    ))}
    <span className="sr-only">Loading table data...</span>
  </div>
);

export default Skeleton;