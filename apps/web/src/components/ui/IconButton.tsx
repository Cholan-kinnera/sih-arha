import React from 'react';
import { cn } from '../../lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      'aria-label': ariaLabel,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer';

    const variantStyles = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] shadow-sm',
      secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-[6px] shadow-sm',
      ghost: 'hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-[6px]',
      danger: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-[6px]',
    };

    const sizeStyles = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-9 h-9 text-sm',
      lg: 'w-11 h-11 text-base',
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
