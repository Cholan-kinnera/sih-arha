import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Mountain, Droplets, CloudRain, Eye, MapPin } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { RiskSeverityBadge } from '../../../components/risk/RiskSeverityBadge';
import type { ZoneDetailedProfile } from '../types/zones.types';

export interface ZonesPriorityGridProps {
  priorityZones: ZoneDetailedProfile[];
  onSelectZone: (zone: ZoneDetailedProfile) => void;
}

export const ZonesPriorityGrid: React.FC<ZonesPriorityGridProps> = ({
  priorityZones,
  onSelectZone,
}) => {
  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          <span>Priority Triage Sectors</span>
        </div>
        <span className="text-[10px] font-mono-data text-slate-400">
          Ranked Deterministically by Susceptibility
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {priorityZones.map((zone) => (
          <Card
            key={zone.id}
            className={`p-3.5 bg-white shadow-2xs space-y-3 transition-colors hover:border-slate-300 ${
              zone.current_severity === 'CRITICAL'
                ? 'border-l-4 border-l-red-600'
                : 'border-l-4 border-l-orange-500'
            }`}
          >
            {/* Header: Zone ID & Severity Badge */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono-data font-bold text-slate-400 uppercase">
                  {zone.id} · {zone.district}
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                  {zone.name}
                </h3>
              </div>
              {zone.current_severity && (
                <RiskSeverityBadge
                  severity={zone.current_severity}
                  score={zone.current_risk_score}
                />
              )}
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-2 rounded-[6px] border border-slate-100 text-center text-xs">
              <div>
                <div className="text-[9px] text-slate-400 font-medium flex items-center justify-center gap-1">
                  <Mountain className="w-3 h-3 text-amber-600" /> Slope
                </div>
                <div className="text-xs font-bold font-mono-data text-slate-900 mt-0.5">
                  {zone.slope.toFixed(1)}°
                </div>
              </div>

              <div>
                <div className="text-[9px] text-slate-400 font-medium flex items-center justify-center gap-1">
                  <CloudRain className="w-3 h-3 text-blue-600" /> 24h Rain
                </div>
                <div className="text-xs font-bold font-mono-data text-slate-900 mt-0.5">
                  {zone.rain_24h_mm.toFixed(0)} <span className="text-[9px] font-normal text-slate-500">mm</span>
                </div>
              </div>

              <div>
                <div className="text-[9px] text-slate-400 font-medium flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3 text-indigo-600" /> Soil Sat.
                </div>
                <div className="text-xs font-bold font-mono-data text-slate-900 mt-0.5">
                  {zone.soil_moisture_pct.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Actions: Inspect & View on Risk Map */}
            <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onSelectZone(zone)}
                leftIcon={<Eye className="w-3.5 h-3.5 text-slate-500" />}
                className="text-[11px] h-7 px-2.5"
              >
                Inspect Profile
              </Button>

              <Link
                to="/map"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors p-1"
              >
                <MapPin className="w-3 h-3" />
                <span>View on Map →</span>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
