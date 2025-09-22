'use client';

import React from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  secondaryActionHref?: string;
  variant?: 'default' | 'error' | 'success' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  secondaryActionLabel,
  onSecondaryAction,
  secondaryActionHref,
  variant = 'default',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
  };

  const iconSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const textSizes = {
    sm: {
      title: 'text-lg',
      description: 'text-sm',
    },
    md: {
      title: 'text-xl',
      description: 'text-base',
    },
    lg: {
      title: 'text-2xl',
      description: 'text-lg',
    },
  };

  const variantClasses = {
    default: {
      icon: 'text-neutral-400',
      title: 'text-neutral-900 dark:text-neutral-100',
      description: 'text-neutral-600 dark:text-neutral-400',
    },
    error: {
      icon: 'text-red-500',
      title: 'text-red-900 dark:text-red-100',
      description: 'text-red-600 dark:text-red-400',
    },
    success: {
      icon: 'text-green-500',
      title: 'text-green-900 dark:text-green-100',
      description: 'text-green-600 dark:text-green-400',
    },
    info: {
      icon: 'text-blue-500',
      title: 'text-blue-900 dark:text-blue-100',
      description: 'text-blue-600 dark:text-blue-400',
    },
  };

  return (
    <div 
      className={`text-center ${sizeClasses[size]}`}
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div className={`mx-auto ${iconSizes[size]} ${variantClasses[variant].icon} mb-4`}>
          {icon}
        </div>
      )}
      
      <h3 className={`font-semibold ${textSizes[size].title} ${variantClasses[variant].title} mb-2`}>
        {title}
      </h3>
      
      <p className={`${textSizes[size].description} ${variantClasses[variant].description} mb-6 max-w-md mx-auto`}>
        {description}
      </p>
      
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {actionLabel && (
            <Button
              variant="primary"
              onClick={onAction}
              href={actionHref}
            >
              {actionLabel}
            </Button>
          )}
          
          {secondaryActionLabel && (
            <Button
              variant="outline"
              onClick={onSecondaryAction}
              href={secondaryActionHref}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export { EmptyState };
export default EmptyState;