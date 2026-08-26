import React from 'react';
import { Globe, Database, History, Activity } from 'lucide-react';
import type { DataSourceType } from '../../types/domain.types';
import { cn } from '../../lib/utils';

export interface ProvenanceBadgeProps {
  type: DataSourceType;
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({ type, className }) => {
  const config = {
    'REAL-WORLD': {
      icon: <Globe className="w-3 h-3 text-blue-600" />,
      label: 'REAL-WORLD',
      classes: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    HISTORICAL: {
      icon: <History className="w-3 h-3 text-slate-600" />,
      label: 'HISTORICAL',
      classes: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    DERIVED: {
      icon: <Database className="w-3 h-3 text-emerald-600" />,
      label: 'DERIVED',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    SIMULATED: {
      icon: <Activity className="w-3 h-3 text-amber-600" />,
      label: 'SIMULATED',
      classes: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  }[type];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border select-none',
        config.classes,
        className
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
