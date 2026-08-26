import React from 'react';
import type { SeverityLevel } from '../../types/domain.types';
import { RiskSeverityBadge } from '../risk/RiskSeverityBadge';

export interface AlertSeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

export const AlertSeverityBadge: React.FC<AlertSeverityBadgeProps> = ({
  severity,
  className,
}) => {
  return <RiskSeverityBadge severity={severity} showScore={false} className={className} />;
};
