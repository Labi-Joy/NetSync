'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

interface PasswordRequirement {
  label: string;
  check: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters',
    check: (pwd) => pwd.length >= 8
  },
  {
    label: 'Contains uppercase letter',
    check: (pwd) => /[A-Z]/.test(pwd)
  },
  {
    label: 'Contains lowercase letter',
    check: (pwd) => /[a-z]/.test(pwd)
  },
  {
    label: 'Contains number',
    check: (pwd) => /\d/.test(pwd)
  },
  {
    label: 'Contains special character (@$!%*?&)',
    check: (pwd) => /[@$!%*?&]/.test(pwd)
  }
];

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  showRequirements = true
}) => {
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: 'No password', color: 'bg-gray-200' };

    const passedRequirements = passwordRequirements.filter(req => req.check(password)).length;

    if (passedRequirements === 0) return { strength: 0, label: 'Very Weak', color: 'bg-red-500' };
    if (passedRequirements === 1) return { strength: 20, label: 'Weak', color: 'bg-red-400' };
    if (passedRequirements === 2) return { strength: 40, label: 'Fair', color: 'bg-orange-400' };
    if (passedRequirements === 3) return { strength: 60, label: 'Good', color: 'bg-yellow-400' };
    if (passedRequirements === 4) return { strength: 80, label: 'Strong', color: 'bg-blue-500' };
    if (passedRequirements === 5) return { strength: 100, label: 'Very Strong', color: 'bg-green-500' };

    return { strength: 0, label: 'Unknown', color: 'bg-gray-200' };
  };

  const { strength, label, color } = getPasswordStrength();
  const isValid = strength === 100;

  if (!password && !showRequirements) return null;

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Password Strength
          </span>
          <span className={`text-sm font-medium ${
            strength >= 80 ? 'text-green-600' :
            strength >= 60 ? 'text-yellow-600' :
            strength >= 40 ? 'text-orange-600' :
            'text-red-600'
          }`}>
            {label}
          </span>
        </div>

        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full transition-all duration-300 ${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${strength}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Password Requirements:
          </span>
          <div className="space-y-1">
            {passwordRequirements.map((requirement, index) => {
              const isPassed = requirement.check(password);
              return (
                <motion.div
                  key={index}
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                    isPassed ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}>
                    {isPassed ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : (
                      <X className="w-3 h-3 text-neutral-500" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    isPassed ? 'text-green-600 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'
                  }`}>
                    {requirement.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Overall Status */}
      {password && (
        <div className={`p-3 rounded-lg border ${
          isValid
            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
            : 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
        }`}>
          <p className={`text-sm ${
            isValid
              ? 'text-green-700 dark:text-green-300'
              : 'text-orange-700 dark:text-orange-300'
          }`}>
            {isValid
              ? '✅ Password meets all requirements'
              : '⚠️ Password does not meet all requirements'
            }
          </p>
        </div>
      )}
    </div>
  );
};

// Validation helper function for external use
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  passwordRequirements.forEach(requirement => {
    if (!requirement.check(password)) {
      errors.push(requirement.label);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default PasswordStrength;