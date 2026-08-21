import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, interactive = false, className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-zinc-900/70 border border-zinc-800 rounded-xl p-5 backdrop-blur-sm shadow-sm transition-all',
          interactive && 'hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-md cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
