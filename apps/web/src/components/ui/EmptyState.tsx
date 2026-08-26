import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <Inbox className="w-9 h-9 text-slate-400" />,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-[8px] border border-dashed border-slate-300 bg-slate-50/50',
        className
      )}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      {description && <p className="text-xs text-slate-500 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
};
