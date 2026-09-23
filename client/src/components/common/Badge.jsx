import React from 'react';

export function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const variantStyles = {
    default: 'bg-cream-200 text-earth-800 border-cream-300',
    sage: 'bg-sage-100 text-sage-800 border-sage-200',
    gold: 'bg-amber-50 text-amber-800 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    outline: 'bg-transparent text-earth-700 border-earth-300',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full border transition-colors ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
