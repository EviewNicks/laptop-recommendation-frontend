'use client';

import React from 'react';
import { LoadingSpinnerProps } from '@/types';

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  const spinner = (
    <svg
      className={`animate-spin ${spinnerSize}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-blue-600">
            {spinner}
          </div>
          {text && (
            <p className="text-gray-700 font-medium">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center space-y-2">
        <div className="text-blue-600">
          {spinner}
        </div>
        {text && (
          <p className="text-gray-700 font-medium text-sm">{text}</p>
        )}
      </div>
    </div>
  );
};

export const Loading: React.FC<{ text?: string; className?: string }> = ({
  text = 'Loading...',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
      </div>
      <div className="h-5 bg-gray-300 rounded w-2/3 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        <div className="h-4 bg-gray-300 rounded w-3/6"></div>
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};