import React from 'react';

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  label?: string;
  displayValue?: string;
  helperText?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 10000,
  onChange,
  label,
  displayValue,
  helperText,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {(label || displayValue) && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          {label && <span>{label}</span>}
          {displayValue && (
            <span className="text-[#3B1FC4] font-bold tabular-nums text-sm">
              {displayValue}
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#3B1FC4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          style={{
            background: `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${percentage}%, #EDE9FE ${percentage}%, #EDE9FE 100%)`
          }}
        />
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}
    </div>
  );
};
