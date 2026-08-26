import React from 'react';
import { cn } from '../../lib/utils';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className,
}) => {
  if (orientation === 'vertical') {
    return <div className={cn('w-[1px] h-full bg-slate-200 mx-2 self-stretch', className)} />;
  }
  return <div className={cn('h-[1px] w-full bg-slate-200 my-4', className)} />;
};
