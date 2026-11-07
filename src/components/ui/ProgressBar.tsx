import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showPercent?: boolean;
  color?: 'primary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercent = true,
  color = 'primary',
  size = 'md',
  className = ''
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const sizeHeights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const barColors = {
    primary: 'bg-[#4F46E5]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
          {label && <span>{label}</span>}
          {showPercent && <span className="tabular-nums font-semibold text-slate-800">{clamped}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeHeights[size]}`}
      >
        <div
          className={`h-full transition-all duration-300 ease-out rounded-full ${barColors[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
