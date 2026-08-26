import React from 'react';
import { Card } from './Card';
import { cn } from '../../lib/utils';
import type { SeverityLevel } from '../../types/domain.types';

export interface MetricCardProps {
  title: string;
  value: string | number;
  secondaryText?: React.ReactNode;
  icon?: React.ReactNode;
  severity?: SeverityLevel;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  secondaryText,
  icon,
  severity,
  className,
}) => {
  const severityStripe = severity
    ? (severity.toLowerCase() as 'low' | 'moderate' | 'high' | 'critical')
    : undefined;

  return (
    <Card variant="standard" severityBorder={severityStripe} className={cn('p-5', className)}>
      <div className="flex items-center justify-between gap-2 text-slate-500 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      <div className="text-3xl font-bold font-mono-data text-slate-900 tracking-tight mb-2">
        {value}
      </div>

      {secondaryText && (
        <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
          {secondaryText}
        </div>
      )}
    </Card>
  );
};
