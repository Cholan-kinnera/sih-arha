import React from 'react';
import { CheckCircle2, AlertCircle, TriangleAlert, ShieldAlert } from 'lucide-react';

export const RiskMapLegend: React.FC = () => {
  const tiers = [
    {
      label: 'Low',
      range: '< 0.40',
      colorBg: 'bg-emerald-600',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
    {
      label: 'Moderate',
      range: '0.40 - 0.59',
      colorBg: 'bg-amber-500',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />,
    },
    {
      label: 'High',
      range: '0.60 - 0.79',
      colorBg: 'bg-orange-500',
      icon: <TriangleAlert className="w-3.5 h-3.5 text-orange-600" />,
    },
    {
      label: 'Critical',
      range: '≥ 0.80',
      colorBg: 'bg-red-600',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-red-600" />,
    },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-[8px] p-2.5 shadow-md flex items-center gap-3 text-xs select-none">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono-data shrink-0">
        Severity Index
      </div>

      <div className="flex items-center gap-3">
        {tiers.map((tier) => (
          <div key={tier.label} className="flex items-center gap-1.5">
            {tier.icon}
            <span className="text-slate-800 font-semibold text-xs">{tier.label}</span>
            <span className="text-[10px] font-mono-data text-slate-400">({tier.range})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
