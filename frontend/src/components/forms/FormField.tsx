'use client';

import React from 'react';
import Input from '@/components/ui/Input';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  success?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  autoComplete?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'underlined';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  maxLength?: number;
  step?: string;
  min?: string;
  max?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: string) => string | null;
  };
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  hint,
  required = false,
  disabled = false,
  loading = false,
  autoComplete,
  size = 'md',
  variant = 'default',
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  maxLength,
  step,
  min,
  max,
  validation,
}) => {
  const [internalError, setInternalError] = React.useState<string>('');
  const [hasBlurred, setHasBlurred] = React.useState(false);

  // Real-time validation
  const validateValue = (val: string): string => {
    if (required && !val.trim()) {
      return `${label} is required`;
    }

    if (validation) {
      if (validation.minLength && val.length < validation.minLength) {
        return `${label} must be at least ${validation.minLength} characters`;
      }

      if (validation.maxLength && val.length > validation.maxLength) {
        return `${label} must not exceed ${validation.maxLength} characters`;
      }

      if (validation.pattern && !validation.pattern.test(val)) {
        if (type === 'email') {
          return 'Please enter a valid email address';
        }
        return `${label} format is invalid`;
      }

      if (validation.customValidator) {
        const customError = validation.customValidator(val);
        if (customError) {
          return customError;
        }
      }
    }

    // Email validation
    if (type === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        return 'Please enter a valid email address';
      }
    }

    // Password strength validation
    if (type === 'password' && val) {
      if (val.length < 8) {
        return 'Password must be at least 8 characters';
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val)) {
        return 'Password must contain uppercase, lowercase, and number';
      }
    }

    return '';
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    
    // Only show validation errors after user has interacted with the field
    if (hasBlurred || newValue.length > 0) {
      const validationError = validateValue(newValue);
      setInternalError(validationError);
    }
  };

  const handleBlur = () => {
    setHasBlurred(true);
    const validationError = validateValue(value);
    setInternalError(validationError);
    onBlur?.();
  };

  // Determine which error to show (external error takes precedence)
  const displayError = error || internalError;
  
  // Determine success state
  const displaySuccess = !displayError && hasBlurred && value.length > 0 ? 
    (success || 'Looks good!') : undefined;

  // Generate helpful hints for password fields
  const getPasswordHint = (): string => {
    if (type !== 'password' || hint) return hint || '';
    
    if (!value) {
      return 'Must be at least 8 characters with uppercase, lowercase, and number';
    }
    
    const checks = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
    };
    
    const missing = [];
    if (!checks.length) missing.push('8+ characters');
    if (!checks.uppercase) missing.push('uppercase letter');
    if (!checks.lowercase) missing.push('lowercase letter');
    if (!checks.number) missing.push('number');
    
    if (missing.length === 0) {
      return 'Strong password ✓';
    }
    
    return `Add: ${missing.join(', ')}`;
  };

  return (
    <Input
      id={name}
      name={name}
      type={type}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      error={displayError}
      success={displaySuccess}
      hint={type === 'password' ? getPasswordHint() : hint}
      required={required}
      disabled={disabled}
      loading={loading}
      autoComplete={autoComplete}
      size={size}
      variant={variant}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      showPasswordToggle={showPasswordToggle || type === 'password'}
      maxLength={maxLength}
      step={step}
      min={min}
      max={max}
      aria-describedby={
        [
          displayError && `${name}-error`,
          displaySuccess && `${name}-success`,
          hint && `${name}-hint`
        ].filter(Boolean).join(' ') || undefined
      }
    />
  );
};

export { FormField };
export default FormField;