import React from 'react';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        className={`rounded-full object-cover ring-2 ring-white shadow-soft-xs ${sizeClasses[size]} ${className}`}
        onError={(e) => {
          // If image fails, hide image and show initials
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-linear-to-tr from-[#3B1FC4] to-[#7C5CF0] text-white font-bold flex items-center justify-center ring-2 ring-white shadow-soft-xs select-none ${sizeClasses[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
