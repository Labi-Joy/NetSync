'use client';

import React, { forwardRef, useState } from 'react';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'underlined';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  loading?: boolean;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  hint,
  size = 'md',
  variant = 'default',
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  loading = false,
  required = false,
  type = 'text',
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    default: `
      border border-neutral-300 rounded-lg bg-white
      focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
      dark:bg-neutral-800 dark:border-neutral-600 dark:focus:border-primary-400
    `,
    filled: `
      border-0 rounded-lg bg-neutral-100
      focus:bg-white focus:ring-2 focus:ring-primary-500/20
      dark:bg-neutral-700 dark:focus:bg-neutral-600
    `,
    underlined: `
      border-0 border-b-2 border-neutral-300 rounded-none bg-transparent
      focus:border-primary-500 focus:ring-0
      dark:border-neutral-600 dark:focus:border-primary-400
    `,
  };

  const getStateClasses = () => {
    if (error) {
      return 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
    }
    if (success) {
      return 'border-green-500 focus:border-green-500 focus:ring-green-500/20';
    }
    return '';
  };

  const inputClasses = `
    w-full transition-all duration-200
    text-neutral-900 placeholder-neutral-400
    dark:text-neutral-100 dark:placeholder-neutral-500
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${getStateClasses()}
    ${leftIcon ? 'pl-10' : ''}
    ${(rightIcon || showPasswordToggle || error || success) ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className={`
            block text-sm font-medium mb-2
            text-neutral-700 dark:text-neutral-300
            ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
          `}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={inputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            [
              error && `${inputId}-error`,
              success && `${inputId}-success`,
              hint && `${inputId}-hint`
            ].filter(Boolean).join(' ') || undefined
          }
          {...props}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {loading && (
            <div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full" />
          )}
          
          {error && !loading && (
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          )}
          
          {success && !loading && !error && (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          )}
          
          {showPasswordToggle && !loading && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          )}
          
          {rightIcon && !showPasswordToggle && !error && !success && !loading && (
            <div className="text-neutral-400 dark:text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      
      {success && !error && (
        <p id={`${inputId}-success`} className="mt-1 text-sm text-green-600 dark:text-green-400">
          {success}
        </p>
      )}
      
      {hint && !error && !success && (
        <p id={`${inputId}-hint`} className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;