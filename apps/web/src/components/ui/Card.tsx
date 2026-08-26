import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'elevated' | 'alert' | 'interactive';
  severityBorder?: 'low' | 'moderate' | 'high' | 'critical';
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'standard',
  severityBorder,
  children,
  ...props
}) => {
  const baseStyles = 'rounded-[8px] border transition-colors';

  const variantStyles = {
    standard: 'bg-white border-slate-200 shadow-sm',
    elevated: 'bg-white border-slate-200 shadow-md',
    alert: 'bg-white border-slate-200 shadow-sm relative overflow-hidden',
    interactive: 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer',
  };

  const severityStripe = {
    low: 'border-l-[4px] border-l-emerald-600',
    moderate: 'border-l-[4px] border-l-amber-500',
    high: 'border-l-[4px] border-l-orange-500',
    critical: 'border-l-[4px] border-l-red-600',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        severityBorder ? severityStripe[severityBorder] : '',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
