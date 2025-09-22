'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'card';
  
  const variantClasses = {
    default: '',
    elevated: 'card-elevated',
    glass: 'card-glass',
    outline: 'border-2 shadow-none',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    hover ? 'hover-lift' : '',
    clickable ? 'cursor-pointer' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;