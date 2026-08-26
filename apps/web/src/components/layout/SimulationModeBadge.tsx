import React from 'react';
import { Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tooltip } from '../ui/Tooltip';

export interface SimulationModeBadgeProps {
  scenarioName?: string;
  className?: string;
}

export const SimulationModeBadge: React.FC<SimulationModeBadgeProps> = ({
  scenarioName = 'Flash Cloudburst Scenario',
  className,
}) => {
  return (
    <Tooltip content="Synthetic stream active for testing & demonstration" side="bottom">
      <div
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 select-none cursor-help',
          className
        )}
      >
        <Activity className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="text-[11px] font-bold tracking-wide">Simulation Mode</span>
        {scenarioName && (
          <span className="text-[10px] opacity-75 font-normal truncate max-w-[140px] hidden sm:inline text-amber-700">
            ({scenarioName})
          </span>
        )}
      </div>
    </Tooltip>
  );
};
