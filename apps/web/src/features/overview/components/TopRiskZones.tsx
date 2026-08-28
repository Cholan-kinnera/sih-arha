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
    <Card className="p-4 bg-white border-slate-200 shadow-2xs flex flex-col justify-between h-[270px] lg:h-[290px]">
      {/* Compact Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Top Priority Catchment Sectors
          </h3>
        </div>
        <span className="text-[10px] font-mono-data text-slate-400">
          Ranked by Vulnerability
        </span>
      </div>

      {/* Zones Table / List */}
      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-1.5 font-medium">Catchment Zone</th>
              <th className="pb-1.5 text-center font-medium">Slope</th>
              <th className="pb-1.5 text-right font-medium">Hazard Status</th>
              <th className="pb-1.5 text-right pr-1 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topZones.map((zone) => (
              <tr
                key={zone.id}
                onClick={() => onSelectZone(zone)}
                className="group hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="py-1.5">
                  <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-xs truncate max-w-[180px]">
                    {zone.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono-data">
                    {zone.id} · {zone.district}
                  </div>
                </td>
                <td className="py-1.5 text-center font-mono-data font-semibold text-slate-700 text-xs">
                  {zone.slope.toFixed(1)}°
                </td>
                <td className="py-1.5 text-right">
                  {zone.current_severity && (
                    <RiskSeverityBadge
                      severity={zone.current_severity}
                      score={zone.current_risk_score}
                    />
                  )}
                </td>
                <td className="py-1.5 text-right pr-1">
                  <span className="inline-flex items-center text-slate-400 group-hover:text-blue-600 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Navigation Action */}
      <div className="border-t border-slate-100 pt-2 mt-2 shrink-0">
        <Link
          to="/zones"
          className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors p-0.5"
        >
          <span>View all {zones.length} monitored sectors →</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
};
