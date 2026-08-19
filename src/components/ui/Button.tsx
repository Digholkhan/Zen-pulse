import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neon-400 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base tracking-wide',
  };

  const variantStyles = {
    primary:
      'bg-neon-500 hover:bg-neon-400 text-zen-950 shadow-neon shadow-neon-500/25 dark:bg-neon-500 dark:hover:bg-neon-400 dark:text-zen-950',
    neon:
      'bg-neon-500 hover:bg-neon-400 text-zen-950 shadow-neon-lg font-black tracking-wider uppercase',
    secondary:
      'bg-zen-100 hover:bg-zen-200 text-zen-800 dark:bg-zen-900/80 dark:hover:bg-zen-800 dark:text-zen-100 border border-zen-200 dark:border-neon-500/20',
    ghost:
      'bg-transparent hover:bg-zen-100/60 text-zen-700 dark:text-zen-200 dark:hover:bg-zen-900/60 dark:hover:text-neon-400',
    outline:
      'border-2 border-neon-500/40 hover:border-neon-400 text-zen-900 dark:text-zen-100 hover:bg-neon-500/10',
    danger:
      'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20',
  };

  return (
    <button
      className={cn(baseStyle, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
