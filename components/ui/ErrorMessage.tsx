'use client';

import React from 'react';
import { ErrorMessageProps } from '@/types';

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  variant = 'default',
}) => {
  const variantClasses: Record<string, string> = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    default: 'bg-red-50 border-red-200 text-red-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };

  const iconClasses: Record<string, string> = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    default: 'text-red-400',
    destructive: 'text-red-400',
    success: 'text-green-400',
  };

  const icons: Record<string, React.ReactElement> = {
    error: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    default: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    destructive: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    success: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  const classes = `
    border rounded-md p-4 mb-6
    ${variantClasses[variant] || variantClasses.default}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={classes}>
      <div className="flex">
        <div className={`flex-shrink-0 ${iconClasses[variant]}`}>
          {icons[variant]}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">
            {variant === 'error' && 'Error'}
            {variant === 'warning' && 'Warning'}
            {variant === 'info' && 'Information'}
          </h3>
          <p className="mt-1 text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm underline hover:opacity-80 transition-opacity"
            >
              Coba lagi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ErrorBoundary: React.FC<{
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}> = ({ children, fallback }) => {
  const [error, setError] = React.useState<Error | null>(null);
  const [retryKey, setRetryKey] = React.useState(0);

  const handleError = (error: Error) => {
    console.error('Error caught by boundary:', error);
    setError(error);
  };

  const retry = () => {
    setError(null);
    setRetryKey(prev => prev + 1);
  };

  React.useEffect(() => {
    const handleErrorEvent = (event: ErrorEvent) => {
      handleError(new Error(event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleError(new Error(event.reason));
    };

    window.addEventListener('error', handleErrorEvent);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleErrorEvent);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (error) {
    if (fallback) {
      const FallbackComponent = fallback;
      return <FallbackComponent error={error} retry={retry} />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Terjadi Kesalahan
            </h1>
            <p className="text-gray-600 mb-6">
              {error.message || 'Halaman tidak dapat dimuat'}
            </p>
            <button
              onClick={retry}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={retryKey}>
      {children}
    </div>
  );
};