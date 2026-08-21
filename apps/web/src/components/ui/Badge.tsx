import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'info' | 'success' | 'warning' | 'neutral' | 'ai';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', className, children, ...props }) => {
  const baseStyles = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors';

  const variants = {
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    neutral: 'bg-zinc-800 text-zinc-300 border-zinc-700/60',
    ai: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </span>
  );
};
