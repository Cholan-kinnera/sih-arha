import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { formatRelativeTime } from '../../lib/date-utils';
import { cn } from '../../lib/utils';

export interface DataFreshnessProps {
  lastUpdated: string | null;
  className?: string;
}

export const DataFreshness: React.FC<DataFreshnessProps> = ({ lastUpdated, className }) => {
  const [, setTick] = useState(0);

  // Force re-render every 5 seconds to update relative time string ("4s ago")
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const relativeText = formatRelativeTime(lastUpdated);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono-data select-none',
        className
      )}
    >
      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span>{relativeText}</span>
    </div>
  );
};
