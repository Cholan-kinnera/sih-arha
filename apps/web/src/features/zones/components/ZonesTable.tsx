import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Droplets, CloudRain, MapPin, Eye, Inbox } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { RiskSeverityBadge } from '../../../components/risk/RiskSeverityBadge';
import type { ZoneDetailedProfile } from '../types/zones.types';

export interface ZonesTableProps {
  zones: ZoneDetailedProfile[];
  onSelectZone: (zone: ZoneDetailedProfile) => void;
}

export const ZonesTable: React.FC<ZonesTableProps> = ({ zones, onSelectZone }) => {
  if (zones.length === 0) {
    return (
      <Card className="p-8 text-center bg-white border-slate-200 shadow-2xs">
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
            <Inbox className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No matching catchment sectors</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No monitored zones match your active search or risk filter criteria. Try adjusting or resetting your filter parameters.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 bg-white border-slate-200 shadow-2xs overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Sector Name & Catchment Basin</th>
              <th className="py-3 px-3">District</th>
              <th className="py-3 px-3 text-center">Slope Angle</th>
              <th className="py-3 px-3 text-center">Elevation</th>
              <th className="py-3 px-3">24h / 72h Rain</th>
              <th className="py-3 px-3">Soil Saturation</th>
              <th className="py-3 px-3 text-right">Hazard Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {zones.map((zone) => (
              <tr
                key={zone.id}
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                onClick={() => onSelectZone(zone)}
              >
                {/* Sector Name & Basin */}
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-xs">
                    {zone.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono-data font-semibold">
                    {zone.id} · {zone.drainage_basin}
                  </div>
                </td>

                {/* District */}
                <td className="py-3 px-3 text-slate-600 font-medium">
                  {zone.district}, {zone.state}
                </td>

                {/* Slope Angle */}
                <td className="py-3 px-3 text-center font-mono-data font-bold text-slate-800">
                  <div className="inline-flex items-center gap-1">
                    <Mountain className="w-3.5 h-3.5 text-amber-600" />
                    <span>{zone.slope.toFixed(1)}°</span>
                  </div>
                </td>

                {/* Elevation */}
                <td className="py-3 px-3 text-center font-mono-data font-semibold text-slate-700">
                  {zone.elevation}m
                </td>

                {/* 24h / 72h Rain */}
                <td className="py-3 px-3 font-mono-data text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>
                      <strong className="font-bold text-slate-900">{zone.rain_24h_mm.toFixed(0)}</strong> / {zone.rain_72h_mm.toFixed(0)} mm
                    </span>
                  </div>
                </td>

                {/* Soil Saturation & Type */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5 font-mono-data font-bold text-slate-900">
                    <Droplets className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{zone.soil_moisture_pct.toFixed(1)}%</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                    {zone.soil_type}
                  </div>
                </td>

                {/* Hazard Status */}
                <td className="py-3 px-3 text-right">
                  {zone.current_severity && (
                    <RiskSeverityBadge
                      severity={zone.current_severity}
                      score={zone.current_risk_score}
                    />
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="inline-flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectZone(zone)}
                      className="text-slate-600 hover:text-blue-600 text-[11px] h-7 px-2"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> Inspect
                    </Button>
                    <Link
                      to="/map"
                      className="inline-flex items-center justify-center w-7 h-7 rounded-[4px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 transition-colors"
                      title="View on Risk Map"
                      aria-label={`View ${zone.name} on Risk Map`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
