import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OVERVIEW_DEMO_DATA } from '../features/overview/data/overview.demo';
import { OverviewHeader } from '../features/overview/components/OverviewHeader';
import { OverviewMetrics } from '../features/overview/components/OverviewMetrics';
import { OverviewRiskMap } from '../features/overview/components/OverviewRiskMap';
import { OverviewAlerts } from '../features/overview/components/OverviewAlerts';
import { RiskTrendCard } from '../features/overview/components/RiskTrendCard';
import { TopRiskZones } from '../features/overview/components/TopRiskZones';
import { OverviewSystemStatus } from '../features/overview/components/OverviewSystemStatus';
import { useUiStore } from '../stores/useUiStore';
import type { Zone } from '../types/domain.types';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { openZoneDrawer } = useUiStore();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const data = OVERVIEW_DEMO_DATA;

  const handleSelectZone = (zone: Zone | null) => {
    setSelectedZone(zone);
  };

  const handleSelectZoneById = (zoneId: string) => {
    const found = data.zones.find((z) => z.id === zoneId);
    if (found) {
      setSelectedZone(found);
    }
  };

  const handleViewZoneDetails = (zoneId: string) => {
    openZoneDrawer(zoneId);
    navigate('/zones');
  };

  return (
    <div className="space-y-4 pb-4">
      {/* 1. Page Header (Compressed Height) */}
      <OverviewHeader
        regionalSeverity={data.kpis.regionalSeverity}
        regionalRiskScore={data.kpis.regionalRiskScore}
        lastUpdatedTimestamp={data.lastUpdatedTimestamp}
      />

      {/* 2. Key Operational Metrics (Unified KPI Strip) */}
      <OverviewMetrics kpis={data.kpis} />

      {/* 3. Primary Operational Workspace (Map + Active Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Risk Map Preview (65% on desktop: 8 cols) */}
        <div className="lg:col-span-8">
          <OverviewRiskMap
            zones={data.zones}
            selectedZone={selectedZone}
            onSelectZone={handleSelectZone}
            onViewZoneDetails={handleViewZoneDetails}
          />
        </div>

        {/* Active Alerts Panel (35% on desktop: 4 cols) */}
        <div className="lg:col-span-4">
          <OverviewAlerts
            alerts={data.alerts}
            onSelectZoneId={handleSelectZoneById}
          />
        </div>
      </div>

      {/* 4. Secondary Analytical Workspace (Trend + Top Priority Catchments) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 72h Precipitation-Driven Risk Trend (6 cols) */}
        <div className="lg:col-span-6">
          <RiskTrendCard data={data.riskTrend} />
        </div>

        {/* Top Priority At-Risk Catchments Table (6 cols) */}
        <div className="lg:col-span-6">
          <TopRiskZones
            zones={data.zones}
            onSelectZone={handleSelectZone}
          />
        </div>
      </div>

      {/* 5. Telemetry Snapshot & Operational System Status Bar */}
      <OverviewSystemStatus
        lastUpdatedTimestamp={data.lastUpdatedTimestamp}
        activeNodesCount={data.activeTelemetryNodesCount}
        totalDataSourcesCount={data.totalDataSourcesCount}
        telemetry={data.environmentalTelemetry}
      />
    </div>
  );
};
