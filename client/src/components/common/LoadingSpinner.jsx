import React from 'react';

export function LoadingSpinner({ size = 'md', text = 'Carregando...' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <div
        className={`${sizeClasses[size]} border-sage-200 border-t-sage-600 rounded-full animate-spin`}
      />
      {text && (
        <span className="text-sm font-medium text-earth-600 font-serif italic tracking-wide">
          {text}
        </span>
      )}
    </div>
  );
}
