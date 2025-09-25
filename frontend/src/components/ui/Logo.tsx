'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  href?: string;
  className?: string;
  animate?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  showTagline = false,
  href = '/',
  className = '',
  animate = false
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  const NetSyncIcon = ({ className: iconClassName = '' }: { className?: string }) => (
    <div className={`relative ${iconClassName}`}>
      <svg
        viewBox="0 0 60 60"
        fill="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="text-blue-500" style={{ stopColor: 'currentColor' }} />
            <stop offset="50%" className="text-purple-500" style={{ stopColor: '#8B5CF6' }} />
            <stop offset="100%" className="text-cyan-500" style={{ stopColor: '#06B6D4' }} />
          </linearGradient>
        </defs>

        <circle cx="30" cy="30" r="25" fill="url(#logoGradient)" />

        {/* Network nodes */}
        <circle cx="22" cy="20" r="3.5" fill="white" opacity="0.95" />
        <circle cx="38" cy="18" r="3.5" fill="white" opacity="0.95" />
        <circle cx="18" cy="35" r="3" fill="white" opacity="0.9" />
        <circle cx="30" cy="40" r="3" fill="white" opacity="0.9" />
        <circle cx="42" cy="35" r="3" fill="white" opacity="0.9" />
        <circle cx="30" cy="25" r="2.5" fill="white" opacity="1" />

        {/* Connection lines */}
        <line x1="22" y1="20" x2="30" y2="25" stroke="white" strokeWidth="2" opacity="0.8" />
        <line x1="38" y1="18" x2="30" y2="25" stroke="white" strokeWidth="2" opacity="0.8" />
        <line x1="30" y1="25" x2="18" y2="35" stroke="white" strokeWidth="2" opacity="0.8" />
        <line x1="30" y1="25" x2="30" y2="40" stroke="white" strokeWidth="2" opacity="0.8" />
        <line x1="30" y1="25" x2="42" y2="35" stroke="white" strokeWidth="2" opacity="0.8" />
        <line x1="18" y1="35" x2="30" y2="40" stroke="white" strokeWidth="1.5" opacity="0.6" />
        <line x1="42" y1="35" x2="30" y2="40" stroke="white" strokeWidth="1.5" opacity="0.6" />

        {/* Additional network connections */}
        <line x1="22" y1="20" x2="38" y2="18" stroke="white" strokeWidth="1" opacity="0.4" />
        <line x1="18" y1="35" x2="42" y2="35" stroke="white" strokeWidth="1" opacity="0.4" />
      </svg>
    </div>
  );

  const NetSyncText = ({ className: textClassName = '' }: { className?: string }) => (
    <div className={`font-bold tracking-tight ${textClassName}`}>
      <span className="text-slate-800 dark:text-slate-200">Net</span>
      <span className="text-blue-600 dark:text-blue-400">Sync</span>
    </div>
  );

  const LogoContent = () => {
    const baseClasses = `flex items-center space-x-3 transition-all duration-200 ${className}`;

    const content = (
      <div className={baseClasses}>
        {(variant === 'full' || variant === 'icon') && (
          <motion.div
            className={sizeClasses[size]}
            animate={animate ? { rotate: [0, 360] } : {}}
            transition={animate ? { duration: 20, repeat: Infinity, ease: "linear" } : {}}
          >
            <NetSyncIcon className={sizeClasses[size]} />
          </motion.div>
        )}

        {(variant === 'full' || variant === 'text') && (
          <div className="flex flex-col">
            <NetSyncText
              className={`
                ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl'}
                leading-tight
              `}
            />
            {showTagline && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Professional Networking Platform
              </span>
            )}
          </div>
        )}
      </div>
    );

    return content;
  };

  if (href) {
    return (
      <Link href={href} className="group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <LogoContent />
        </motion.div>
      </Link>
    );
  }

  return <LogoContent />;
};

export default Logo;