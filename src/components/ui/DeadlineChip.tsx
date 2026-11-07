import React from 'react';

export interface DeadlineChipProps {
  daysLeft: number;
  label?: string;
  className?: string;
}

export const DeadlineChip: React.FC<DeadlineChipProps> = ({
  daysLeft,
  label,
  className = ''
}) => {
  let text = label;
  if (!text) {
    if (daysLeft < 0) text = 'Expired';
    else if (daysLeft === 0) text = 'Today!';
    else if (daysLeft === 1) text = 'Tomorrow';
    else text = `In ${daysLeft} days`;
  }

  let style = 'bg-sky-50 text-sky-700 border-sky-200';
  if (daysLeft <= 3 && daysLeft >= 0) {
    style = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
  } else if (daysLeft <= 7 && daysLeft >= 0) {
    style = 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
  } else if (daysLeft < 0) {
    style = 'bg-slate-100 text-slate-500 border-slate-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border tracking-tight tabular-nums whitespace-nowrap select-none ${style} ${className}`}
    >
      {text}
    </span>
  );
};
