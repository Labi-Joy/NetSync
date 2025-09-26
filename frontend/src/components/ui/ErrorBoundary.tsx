'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: this.generateEventId(),
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
      eventId: this.generateEventId(),
    });

    // Call the optional error handler
    this.props.onError?.(error, errorInfo);

    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when resetKeys change
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys![index]
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }

    // Reset error boundary when any props change
    if (hasError && resetOnPropsChange) {
      this.resetErrorBoundary();
    }
  }

  private generateEventId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Implement error reporting to your preferred service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
      eventId: this.state.eventId,
    };

    // You would replace this with your actual error reporting service
    console.warn('Error reported:', errorReport);
  };

  private resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        eventId: this.generateEventId(),
      });
    }, 100);
  };

  private handleRetry = () => {
    this.resetErrorBoundary();
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private copyErrorDetails = () => {
    const { error, errorInfo, eventId } = this.state;
    const errorDetails = JSON.stringify({
      eventId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    }, null, 2);

    navigator.clipboard.writeText(errorDetails).then(() => {
      alert('Error details copied to clipboard');
    });
  };

  render() {
    const { hasError, error, errorInfo, eventId } = this.state;
    const { children, fallback, showErrorDetails = process.env.NODE_ENV === 'development' } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6">
          <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>

            <div className="text-center">
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Something went wrong
              </h1>

              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                We apologize for the inconvenience. An unexpected error occurred while loading this page.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="primary"
                  onClick={this.handleRetry}
                  leftIcon={<ArrowPathIcon className="w-4 h-4" />}
                >
                  Try Again
                </Button>

                <Button
                  variant="outline"
                  onClick={this.handleReload}
                >
                  Reload Page
                </Button>
              </div>

              {showErrorDetails && error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100">
                    Error Details (Event ID: {eventId})
                  </summary>

                  <div className="mt-3 p-3 bg-neutral-100 dark:bg-neutral-800 rounded border text-xs">
                    <div className="mb-2">
                      <strong>Error:</strong> {error.message}
                    </div>

                    {error.stack && (
                      <div className="mb-2">
                        <strong>Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap break-all text-xs">
                          {error.stack}
                        </pre>
                      </div>
                    )}

                    {errorInfo?.componentStack && (
                      <div className="mb-2">
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap break-all text-xs">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={this.copyErrorDetails}
                      className="mt-2"
                    >
                      Copy Error Details
                    </Button>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

// Functional wrapper for easier usage
interface ErrorBoundaryWrapperProps extends Omit<ErrorBoundaryProps, 'children'> {
  children: ReactNode;
}

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

// Specific error boundary for async operations
export const AsyncErrorBoundary: React.FC<ErrorBoundaryWrapperProps> = ({ children, ...props }) => (
  <ErrorBoundary
    {...props}
    onError={(error, errorInfo) => {
      // Handle async errors specifically
      console.error('Async operation failed:', error);
      props.onError?.(error, errorInfo);
    }}
  >
    {children}
  </ErrorBoundary>
);

export { ErrorBoundary };
export default ErrorBoundary;