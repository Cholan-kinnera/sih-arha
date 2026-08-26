import React from 'react';
import { cn } from '../../lib/utils';
import { getSeverityFromScore, formatRiskScore } from '../../lib/risk-semantics';

export interface RiskScoreGaugeProps {
  score: number;
  showLabels?: boolean;
  className?: string;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  score,
  showLabels = true,
  className,
}) => {
  const clampedScore = Math.max(0, Math.min(1, score));
  const percentage = clampedScore * 100;
  const severity = getSeverityFromScore(clampedScore);

  const fillClass = {
    LOW: 'bg-emerald-600',
    MODERATE: 'bg-amber-500',
    HIGH: 'bg-orange-500',
    CRITICAL: 'bg-red-600',
  }[severity];

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
        <span>Risk Index</span>
        <span className="font-mono-data text-slate-900 font-bold text-sm">
          {formatRiskScore(clampedScore)} <span className="text-slate-400 text-xs font-normal">/ 1.00</span>
        </span>
      </div>

      <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300 rounded-full', fillClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showLabels && (
        <div className="flex justify-between text-[10px] text-slate-400 font-mono-data mt-1">
          <span>0.00 (Low)</span>
          <span>0.30</span>
          <span>0.60</span>
          <span>0.80 (Crit)</span>
          <span>1.00</span>
        </div>
      )}
    </div>
  );
};
