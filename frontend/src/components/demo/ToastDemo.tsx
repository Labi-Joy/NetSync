'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';

export const ToastDemo: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo, hideAllToasts } = useToast();

  const handleShowSuccess = () => {
    showSuccess(
      'Success!',
      'Your profile has been updated successfully.',
      {
        action: {
          label: 'View Profile',
          onClick: () => console.log('Navigate to profile')
        }
      }
    );
  };

  const handleShowError = () => {
    showError(
      'Error occurred',
      'Failed to save your changes. Please try again.',
      {
        persistent: true,
        action: {
          label: 'Retry',
          onClick: () => console.log('Retrying...')
        }
      }
    );
  };

  const handleShowWarning = () => {
    showWarning(
      'Warning',
      'Your session will expire in 5 minutes.',
      {
        duration: 8000,
        action: {
          label: 'Extend Session',
          onClick: () => console.log('Extending session...')
        }
      }
    );
  };

  const handleShowInfo = () => {
    showInfo(
      'New feature available',
      'Check out the new AI-powered matching algorithm!'
    );
  };

  const handleShowMultiple = () => {
    showSuccess('Upload complete', 'Your file has been uploaded.');
    setTimeout(() => showInfo('Processing', 'File is being processed...'), 500);
    setTimeout(() => showWarning('Review required', 'Please review the uploaded content.'), 1000);
  };

  return (
    <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
        Toast Notifications Demo
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShowSuccess}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          Show Success
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShowError}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          Show Error
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShowWarning}
          className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
        >
          Show Warning
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShowInfo}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          Show Info
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleShowMultiple}
        >
          Show Multiple
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={hideAllToasts}
          className="text-neutral-600 border-neutral-200 hover:bg-neutral-50"
        >
          Clear All
        </Button>
      </div>

      <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        <p>Features demonstrated:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Different toast types (success, error, warning, info)</li>
          <li>Action buttons with custom handlers</li>
          <li>Persistent toasts (error example)</li>
          <li>Custom durations (warning example)</li>
          <li>Multiple toasts with automatic queue management</li>
          <li>Manual toast dismissal</li>
        </ul>
      </div>
    </div>
  );
};

export default ToastDemo;