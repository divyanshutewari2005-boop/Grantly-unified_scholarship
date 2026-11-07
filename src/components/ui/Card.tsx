import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  bordered?: boolean;
  glass?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  bordered = true,
  glass = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${
        glass
          ? 'bg-white/85 backdrop-blur-md shadow-glass border border-white/60'
          : 'bg-white shadow-soft-sm'
      } ${bordered && !glass ? 'border border-slate-200/80' : ''} ${
        hoverEffect ? 'hover:shadow-soft-md hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
