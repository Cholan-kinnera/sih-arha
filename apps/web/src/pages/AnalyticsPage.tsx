import React, { useState } from 'react';
import { useAnalytics } from '../features/analytics/hooks/useAnalytics';
import { AnalyticsHeader } from '../features/analytics/components/AnalyticsHeader';
import { AnalyticsToolbar } from '../features/analytics/components/AnalyticsToolbar';
import { RegionalRiskTrajectoryChart } from '../features/analytics/components/RegionalRiskTrajectoryChart';
import { CaineThresholdAnalysisChart } from '../features/analytics/components/CaineThresholdAnalysisChart';
import { ZoneRiskComparisonChart } from '../features/analytics/components/ZoneRiskComparisonChart';
import { SoilMoistureSlopeScatterChart } from '../features/analytics/components/SoilMoistureSlopeScatterChart';
import { RainfallAccumulationChart } from '../features/analytics/components/RainfallAccumulationChart';
import { AnalyticsSkeleton } from '../features/analytics/components/AnalyticsSkeleton';

export const AnalyticsPage: React.FC = () => {
  const {
    filters,
    setTimeRange,
    setSelectedBasin,
    resetFilters,
    metrics,
    trajectoryData,
    caineData,
    zoneComparisonData,
    soilSlopeData,
    rainfallAccumulationData,
  } = useAnalytics();

  const [isLoading] = useState(false);

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="space-y-4 pb-4">
      {/* 1. Summary Header & Metrics Strip */}
      <AnalyticsHeader
        metrics={metrics}
        lastUpdatedTimestamp={new Date().toISOString()}
      />

      {/* 2. Analytical Filtering Toolbar */}
      <AnalyticsToolbar
        timeRange={filters.timeRange}
        onTimeRangeChange={setTimeRange}
        selectedBasin={filters.selectedBasin}
        onBasinChange={setSelectedBasin}
        onResetFilters={resetFilters}
      />

      {/* 3. Primary Analytical Visualizations Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* View 1: 72-Hour Regional Risk Trajectory */}
        <RegionalRiskTrajectoryChart data={trajectoryData} />

        {/* View 2: Rainfall / Empirical Caine Threshold Analysis */}
        <CaineThresholdAnalysisChart data={caineData} />

        {/* View 3: Zone Risk Comparison & Baseline Divergence */}
        <ZoneRiskComparisonChart data={zoneComparisonData} />

        {/* View 4: Geotechnical Soil Saturation × Slope Angle */}
        <SoilMoistureSlopeScatterChart data={soilSlopeData} />
      </div>

      {/* 4. Secondary Analytical Visualization (View 5: 24h vs. 72h Precipitation Accumulation) */}
      <RainfallAccumulationChart data={rainfallAccumulationData} />
    </div>
  );
};
