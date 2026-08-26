import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, ChevronRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { RiskSeverityBadge } from '../../../components/risk/RiskSeverityBadge';
import type { Zone } from '../../../types/domain.types';

export interface TopRiskZonesProps {
  zones: Zone[];
  onSelectZone: (zone: Zone) => void;
}

export const TopRiskZones: React.FC<TopRiskZonesProps> = ({ zones, onSelectZone }) => {
  // Sort descending by risk score, take top 5
  const topZones = [...zones]
    .sort((a, b) => (b.current_risk_score ?? 0) - (a.current_risk_score ?? 0))
    .slice(0, 5);

  return (
    <Card className="p-5 bg-white border-slate-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Top Priority Catchment Sectors
          </h3>
        </div>
        <span className="text-[11px] font-mono-data text-slate-400">
          Ranked by Vulnerability
        </span>
      </div>

      {/* Zones Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-2">Catchment Zone</th>
              <th className="pb-2 text-center">Slope</th>
              <th className="pb-2 text-right">Hazard Status</th>
              <th className="pb-2 text-right pr-1">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topZones.map((zone) => (
              <tr
                key={zone.id}
                onClick={() => onSelectZone(zone)}
                className="group hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="py-2.5">
                  <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {zone.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono-data">
                    {zone.id} · {zone.district}
                  </div>
                </td>
                <td className="py-2.5 text-center font-mono-data font-semibold text-slate-700">
                  {zone.slope.toFixed(1)}°
                </td>
                <td className="py-2.5 text-right">
                  {zone.current_severity && (
                    <RiskSeverityBadge
                      severity={zone.current_severity}
                      score={zone.current_risk_score}
                    />
                  )}
                </td>
                <td className="py-2.5 text-right pr-1">
                  <span className="inline-flex items-center text-slate-400 group-hover:text-blue-600 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Navigation Action */}
      <div className="border-t border-slate-100 pt-3 mt-3">
        <Link
          to="/zones"
          className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors p-1"
        >
          <span>View all 24 monitored basin sectors & geotechnical profiles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
};
