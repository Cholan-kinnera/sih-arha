import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer';

    const variantStyles = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:bg-blue-800',
      secondary:
        'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm active:bg-slate-100',
      ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 active:bg-slate-200',
      danger:
        'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 active:bg-red-200',
    };

    const sizeStyles = {
      sm: 'text-xs h-8 px-2.5 rounded-[4px] gap-1.5',
      md: 'text-sm h-9 px-4 rounded-[6px] gap-2',
      lg: 'text-base h-11 px-5 rounded-[6px] gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
