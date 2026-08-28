import React from 'react';
import { ShieldAlert, TriangleAlert, AlertCircle, CheckCircle2, Sliders } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { SEVERITY_CONFIGS } from '../../../lib/risk-semantics';
import type { SeverityLevel } from '../../../types/domain.types';

export const SeverityThresholdsCard: React.FC = () => {
  const tiers: {
    level: SeverityLevel;
    range: string;
    description: string;
    actionProtocol: string;
    icon: React.ReactNode;
  }[] = [
    {
      level: 'LOW',
      range: '0.00 – 0.29',
      description: 'Normal hydro-meteorological baseline conditions. Slopes remain well below failure thresholds.',
      actionProtocol: 'Routine 60-minute telemetry polling.',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
    {
      level: 'MODERATE',
      range: '0.30 – 0.59',
      description: 'Heightened meteorological activity or elevated antecedent soil saturation in catchment slopes.',
      actionProtocol: 'Advisory logged. Polling interval increased to 15 minutes.',
      icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
    },
    {
      level: 'HIGH',
      range: '0.60 – 0.79',
      description: 'Formal Warning Threshold crossed (0.60). High probability of localized shallow debris flows.',
      actionProtocol: 'Formal Warning alert dispatched. Field teams alerted for culvert and cut-slope inspection.',
      icon: <TriangleAlert className="w-4 h-4 text-orange-600" />,
    },
    {
      level: 'CRITICAL',
      range: '0.80 – 1.00',
      description: 'Emergency Threshold crossed (0.80). Imminent catastrophic slope failure hazard envelope.',
      actionProtocol: 'Emergency dispatch triggered. Immediate evacuation advisory recommended for downslope sectors.',
      icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
    },
  ];

  return (
    <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-3 font-sans select-none">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-red-50 text-red-600 flex items-center justify-center">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              Categorical Severity Thresholds & Action Protocols
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Deterministic mapping from normalized continuous risk score to operational emergency tiers.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono-data text-slate-400">
          Four-Factor Semantic Standard
        </span>
      </div>

      {/* 4 Severity Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tiers.map((tier) => {
          const config = SEVERITY_CONFIGS[tier.level];

          return (
            <div
              key={tier.level}
              className="p-3 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-2 text-xs"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  {tier.icon}
                  <span>{tier.level}</span>
                </div>
                <span
                  style={{ color: config.colorHex }}
                  className="font-mono-data font-bold text-xs bg-white px-2 py-0.5 rounded border border-slate-200"
                >
                  Score: {tier.range}
                </span>
              </div>

              {/* Description */}
              <p className="text-slate-600 leading-snug text-[11px]">
                {tier.description}
              </p>

              {/* Action Protocol */}
              <div className="text-[11px] pt-1 border-t border-slate-200/60 text-slate-700">
                <strong className="text-slate-900">Protocol:</strong> {tier.actionProtocol}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
