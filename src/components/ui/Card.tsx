import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, glass = true, className, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-3xl p-6 transition-all duration-300',
        glass ? 'glass-card' : 'bg-white dark:bg-zen-900/80 border border-zen-200/60 dark:border-zen-800/60 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
