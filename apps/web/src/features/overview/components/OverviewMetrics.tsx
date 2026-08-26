import React from 'react';
import { MapPin, TrendingUp, TriangleAlert, CloudRain } from 'lucide-react';
import { MetricCard } from '../../../components/ui/MetricCard';
import type { OverviewKpiData } from '../types/overview.types';

export interface OverviewMetricsProps {
  kpis: OverviewKpiData;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Monitored Zones"
        value={kpis.monitoredZonesCount}
        icon={<MapPin className="w-4 h-4 text-blue-600" />}
        secondaryText="All monitored zones active"
      />

      <MetricCard
        title="Regional Risk"
        value={kpis.regionalRiskScore.toFixed(2)}
        severity={kpis.regionalSeverity}
        icon={<TrendingUp className="w-4 h-4 text-orange-600" />}
        secondaryText={kpis.regionalRiskTrendText}
      />

      <MetricCard
        title="Critical Alerts"
        value={kpis.criticalAlertsCount}
        severity="CRITICAL"
        icon={<TriangleAlert className="w-4 h-4 text-red-600" />}
        secondaryText={`${kpis.unacknowledgedAlertsCount} unacknowledged`}
      />

      <MetricCard
        title="24h Peak Rainfall"
        value={`${kpis.peakRainfall24h.toFixed(1)} mm`}
        severity="HIGH"
        icon={<CloudRain className="w-4 h-4 text-blue-600" />}
        secondaryText={kpis.peakRainfallZoneName}
      />
    </div>
  );
};
