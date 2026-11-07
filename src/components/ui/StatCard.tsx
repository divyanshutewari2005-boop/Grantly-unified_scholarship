import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
  badgeText: string;
  badgeType?: 'success' | 'warning' | 'danger' | 'info';
  badgeIcon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  icon,
  iconBgColor = 'bg-[#EDE9FE]',
  iconTextColor = 'text-[#3B1FC4]',
  badgeText,
  badgeType = 'success',
  badgeIcon,
  onClick,
  className = ''
}) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 600;
    const steps = 25;
    const increment = count / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= count) {
        setDisplayCount(count);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [count]);

  const badgeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-rose-50 text-rose-700 border-rose-100 font-semibold',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-100'
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft-sm transition-all duration-200 text-left select-none ${
        onClick
          ? 'cursor-pointer hover:shadow-soft-md hover:-translate-y-0.5 hover:border-indigo-200'
          : ''
      } ${className}`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${iconBgColor} ${iconTextColor}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {displayCount}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-600 truncate mt-0.5">
            {title}
          </p>
        </div>
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center">
        <div
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${badgeStyles[badgeType]}`}
        >
          {badgeIcon}
          <span>{badgeText}</span>
        </div>
      </div>
    </div>
  );
};
