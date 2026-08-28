import React, { useState } from 'react';
import { Map, Layers, Radio, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { RiskSeverityBadge } from '../components/risk/RiskSeverityBadge';
import { DataFreshness } from '../components/layout/DataFreshness';
import { OVERVIEW_DEMO_DATA } from '../features/overview/data/overview.demo';
import { useRiskMap } from '../features/risk-map/hooks/useRiskMap';
import { RiskMapToolbar } from '../features/risk-map/components/RiskMapToolbar';
import { RiskMapContainer } from '../features/risk-map/components/RiskMapContainer';
import { ZoneDetailDrawer } from '../features/risk-map/components/ZoneDetailDrawer';
import { RiskMapSkeleton } from '../features/risk-map/components/RiskMapSkeleton';

export const RiskMapPage: React.FC = () => {
  const {
    layers,
    selectedZone,
    filters,
    filteredZones,
    allZonesCount,
    toggleLayer,
    selectZone,
    setSearchQuery,
    setSelectedSeverity,
    setMinSlopeDegrees,
    resetFilters,
  } = useRiskMap();

  const [isLoading] = useState(false);
  const data = OVERVIEW_DEMO_DATA;

  if (isLoading) {
    return <RiskMapSkeleton />;
  }

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
            Geospatial Hazard Risk Map Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geospatial hazard zoning, terrain susceptibility polygons, IMD precipitation mesh, and real-time catchment monitoring.
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

      {/* Spatial Toolbar (Search & Filters) */}
      <RiskMapToolbar
        searchQuery={filters.searchQuery}
        onSearchChange={setSearchQuery}
        selectedSeverity={filters.selectedSeverity}
        onSeverityChange={setSelectedSeverity}
        minSlope={filters.minSlopeDegrees}
        onMinSlopeChange={setMinSlopeDegrees}
        visibleCount={filteredZones.length}
        totalCount={allZonesCount}
        onResetFilters={resetFilters}
      />

      {/* Main Full-Viewport Leaflet Map Container */}
      <RiskMapContainer
        zones={filteredZones}
        selectedZone={selectedZone}
        onSelectZone={selectZone}
        layers={layers}
        onToggleLayer={toggleLayer}
      />

      {/* Reusable Comprehensive Zone Intelligence Inspector Drawer */}
      <ZoneDetailDrawer zone={selectedZone} onClose={() => selectZone(null)} />

      {/* Operational Context Bar */}
      <Card className="p-3 bg-white border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold">Active Layers:</span>
          <span className="text-slate-500">
            {layers.hazardZones && 'Hazard Polygons (24 Sectors), '}
            {layers.rainfallMesh && 'IMD 24h Rain Mesh, '}
            {layers.historicalScars && 'GSI Scars (3 Points), '}
            {layers.sensorStations && '5 Sensor Stations'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 font-mono-data text-[11px]">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse shrink-0" />
          <span>Realtime Telemetry Active</span>
          <span className="h-3 w-[1px] bg-slate-200" />
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Validated Dataset</span>
        </div>
      </Card>
    </div>
  );
};
