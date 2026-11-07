import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rounded';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = 'h-4 w-full',
  variant = 'rounded'
}) => {
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rounded: 'rounded-xl'
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${variantStyles[variant]} ${className}`}
      aria-hidden="true"
    />
  );
};
