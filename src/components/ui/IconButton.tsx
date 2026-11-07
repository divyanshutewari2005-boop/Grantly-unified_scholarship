import React, { forwardRef } from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  variant = 'ghost',
  size = 'md',
  label,
  className = '',
  disabled,
  ...props
}, ref) => {
  const sizeStyles = {
    sm: 'w-8 h-8 p-1.5 rounded-lg text-xs',
    md: 'w-10 h-10 p-2 rounded-xl text-sm',
    lg: 'w-12 h-12 p-3 rounded-2xl text-base'
  };

  const variantStyles = {
    primary: 'bg-[#3B1FC4] hover:bg-[#4F46E5] text-white shadow-soft-xs',
    secondary: 'bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#3B1FC4]',
    outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white shadow-soft-xs',
    ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
});

IconButton.displayName = 'IconButton';
