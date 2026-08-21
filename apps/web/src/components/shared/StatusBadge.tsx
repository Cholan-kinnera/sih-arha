import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { EvaluationState } from '../../types/eligibility.types';

export interface StatusBadgeProps {
  state: EvaluationState;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ state, className }) => {
  switch (state) {
    case 'ELIGIBLE':
      return (
        <Badge variant="success" className={className}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>ELIGIBLE</span>
        </Badge>
      );
    case 'POTENTIALLY_ELIGIBLE':
      return (
        <Badge variant="warning" className={className}>
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>POTENTIALLY ELIGIBLE</span>
        </Badge>
      );
    case 'INSUFFICIENT_INFORMATION':
      return (
        <Badge variant="info" className={className}>
          <HelpCircle className="w-3.5 h-3.5" />
          <span>INSUFFICIENT INFO</span>
        </Badge>
      );
    case 'NOT_ELIGIBLE':
      return (
        <Badge variant="neutral" className={className}>
          <XCircle className="w-3.5 h-3.5" />
          <span>NOT ELIGIBLE</span>
        </Badge>
      );
    default:
      return <Badge variant="neutral">{state}</Badge>;
  }
};
