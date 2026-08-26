import React from 'react';
import { CheckCircle2, AlertCircle, TriangleAlert, ShieldAlert } from 'lucide-react';
import type { SeverityLevel } from '../../types/domain.types';
import { getSeverityConfig, formatRiskScore } from '../../lib/risk-semantics';
import { cn } from '../../lib/utils';

export interface RiskSeverityBadgeProps {
  severity: SeverityLevel;
  score?: number;
  showScore?: boolean;
  className?: string;
}

export const RiskSeverityBadge: React.FC<RiskSeverityBadgeProps> = ({
  severity,
  score,
  showScore = true,
  className,
}) => {
  const config = getSeverityConfig(severity);

  const getIcon = () => {
    switch (severity) {
      case 'CRITICAL':
        return <ShieldAlert className="w-3.5 h-3.5 shrink-0" />;
      case 'HIGH':
        return <TriangleAlert className="w-3.5 h-3.5 shrink-0" />;
      case 'MODERATE':
        return <AlertCircle className="w-3.5 h-3.5 shrink-0" />;
      case 'LOW':
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  const borderClass = {
    LOW: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    MODERATE: 'border-amber-200 bg-amber-50 text-amber-800',
    HIGH: 'border-orange-200 bg-orange-50 text-orange-800',
    CRITICAL: 'border-red-200 bg-red-50 text-red-700',
  }[severity];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none',
        borderClass,
        className
      )}
    >
      {getIcon()}
      <span>{config.label}</span>
      {showScore && score !== undefined && (
        <span className="font-mono-data text-[11px] opacity-90 pl-0.5 font-medium">
          ({formatRiskScore(score)})
        </span>
      )}
    </span>
  );
};
