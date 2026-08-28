import React from 'react';
import { Layers, Mountain, Droplets } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { RiskSeverityBadge } from '../components/risk/RiskSeverityBadge';
import { OVERVIEW_DEMO_DATA } from '../features/overview/data/overview.demo';
import { useUiStore } from '../stores/useUiStore';

export const ZonesPage: React.FC = () => {
  const { openZoneDrawer } = useUiStore();
  const zones = OVERVIEW_DEMO_DATA.zones;

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase select-none">
            Basin Sectors Inventory
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Monitored Zones Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Catchment slope profiles, geotechnical soil taxonomies, and localized hazard vulnerability metrics.
          </p>
        </div>
        <div className="text-right text-xs font-mono-data text-slate-500">
          <strong className="text-slate-900 font-bold">{zones.length}</strong> Catchment Sectors Active
        </div>
      </div>

      {/* Directory Table */}
      <Card className="p-0 bg-white border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">Zone ID & Catchment Name</th>
                <th className="py-2.5 px-3">District / State</th>
                <th className="py-2.5 px-3 text-center">Slope Angle</th>
                <th className="py-2.5 px-3 text-center">Elevation</th>
                <th className="py-2.5 px-3">Soil Taxonomy</th>
                <th className="py-2.5 px-3 text-right">Hazard Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {zones.map((zone) => (
                <tr
                  key={zone.id}
                  onClick={() => openZoneDrawer(zone.id)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    <div>{zone.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono-data font-semibold">{zone.id}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {zone.district}, {zone.state}
                  </td>
                  <td className="py-3 px-3 text-center font-mono-data font-semibold text-slate-700">
                    <div className="inline-flex items-center gap-1">
                      <Mountain className="w-3.5 h-3.5 text-slate-400" />
                      <span>{zone.slope.toFixed(1)}°</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-mono-data font-semibold text-slate-700">
                    {zone.elevation}m
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{zone.soil_type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {zone.current_severity && (
                      <RiskSeverityBadge
                        severity={zone.current_severity}
                        score={zone.current_risk_score}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
