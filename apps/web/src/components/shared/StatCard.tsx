import React from 'react';
import { Card } from '../ui/Card';
import type { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'emerald' | 'amber' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'neutral',
}) => {
  const iconColors = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    neutral: 'text-zinc-400 bg-zinc-800 border-zinc-700/50',
  };

  return (
    <Card className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${iconColors[variant]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-bold text-zinc-100 tracking-tight">{value}</div>
        <div className="text-xs font-medium text-zinc-400">{label}</div>
        {subtext && <div className="text-[11px] text-zinc-500 mt-0.5">{subtext}</div>}
      </div>
    </Card>
  );
};
