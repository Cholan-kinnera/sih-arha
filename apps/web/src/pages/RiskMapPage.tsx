import React from 'react';
import { Map, Layers, Radio, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { RiskSeverityBadge } from '../components/risk/RiskSeverityBadge';
import { DataFreshness } from '../components/layout/DataFreshness';
import { OVERVIEW_DEMO_DATA } from '../features/overview/data/overview.demo';
import { OverviewRiskMap } from '../features/overview/components/OverviewRiskMap';
import { useUiStore } from '../stores/useUiStore';
import type { Zone } from '../types/domain.types';

export const RiskMapPage: React.FC = () => {
  const { openZoneDrawer } = useUiStore();
  const [selectedZone, setSelectedZone] = React.useState<Zone | null>(null);
  const data = OVERVIEW_DEMO_DATA;

  const handleSelectZone = (zone: Zone | null) => {
    setSelectedZone(zone);
  };

  const handleViewZoneDetails = (zoneId: string) => {
    openZoneDrawer(zoneId);
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase select-none">
            Spatial Intelligence
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-600" />
            Interactive Risk Map Console
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geospatial hazard zoning, terrain susceptibility polygons, and real-time catchment monitoring.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-[6px] border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500">Basin Severity:</span>
            <RiskSeverityBadge severity={data.kpis.regionalSeverity} score={data.kpis.regionalRiskScore} />
          </div>
          <div className="hidden sm:flex items-center bg-white px-2.5 py-1 rounded-[6px] border border-slate-200 shadow-2xs text-[11px]">
            <DataFreshness lastUpdated={data.lastUpdatedTimestamp} />
          </div>
        </div>
      </div>

      {/* Main Full-Width Map Canvas */}
      <OverviewRiskMap
        zones={data.zones}
        selectedZone={selectedZone}
        onSelectZone={handleSelectZone}
        onViewZoneDetails={handleViewZoneDetails}
      />

      {/* Operational Context Bar */}
      <Card className="p-3 bg-white border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold">Active Layers:</span>
          <span className="text-slate-500">Wayanad Catchment Mesh (24 Sectors), Hydro-geological Polygons, GSI Susceptibility Index</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 font-mono-data text-[11px]">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse shrink-0" />
          <span>Realtime Stream Active</span>
          <span className="h-3 w-[1px] bg-slate-200" />
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Validated Dataset</span>
        </div>
      </Card>
    </div>
  );
};
