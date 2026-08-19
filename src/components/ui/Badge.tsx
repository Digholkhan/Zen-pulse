import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'zen' | 'accent' | 'warning' | 'purple' | 'blue' | 'neon';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'zen', className }) => {
  const variantStyles = {
    zen: 'bg-zen-100 text-zen-800 dark:bg-zen-900/80 dark:text-zen-300 border border-zen-200 dark:border-zen-800',
    neon: 'bg-neon-500/15 text-neon-400 border border-neon-500/30 font-bold shadow-sm',
    accent: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    blue: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
