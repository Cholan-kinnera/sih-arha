import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useOverview } from '../features/overview/hooks/useOverview';
import { OverviewHeader } from '../features/overview/components/OverviewHeader';
import { OverviewMetrics } from '../features/overview/components/OverviewMetrics';
import { OverviewRiskMap } from '../features/overview/components/OverviewRiskMap';
import { OverviewAlerts } from '../features/overview/components/OverviewAlerts';
import { RiskTrendCard } from '../features/overview/components/RiskTrendCard';
import { TopRiskZones } from '../features/overview/components/TopRiskZones';
import { OverviewSystemStatus } from '../features/overview/components/OverviewSystemStatus';
import { ZoneDetailDrawer } from '../features/risk-map/components/ZoneDetailDrawer';
import { Button } from '../components/ui/Button';
import { useUiStore } from '../stores/useUiStore';
import type { Zone } from '../types/domain.types';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { openZoneDrawer } = useUiStore();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const { data, error, isBackendUnavailable, refetch } = useOverview();

  const handleSelectZone = (zone: Zone | null) => {
    setSelectedZone(zone);
  };

  const handleSelectZoneById = (zoneId: string) => {
    const found = data.zones.find((z: Zone) => z.id === zoneId);
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
      {/* Backend / Network Alert Banner if degraded */}
      {isBackendUnavailable && (
        <div className="bg-amber-50 border border-amber-200 rounded-[6px] p-3 flex items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Backend Connectivity Degraded:</span>{' '}
              {error || 'Unable to connect to live API. Showing cached/simulated baseline metrics.'}
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => refetch()}
            className="shrink-0 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Connection</span>
          </Button>
        </div>
      )}

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

      {/* 6. Zone Detail Drawer */}
      <ZoneDetailDrawer zone={selectedZone} onClose={() => setSelectedZone(null)} />
    </div>
  );
};
