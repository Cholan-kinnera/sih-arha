import React from 'react';
import { LineChart as LineChartIcon, CloudRain, Droplets, Mountain } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { RiskTrendCard } from '../features/overview/components/RiskTrendCard';
import { OVERVIEW_DEMO_DATA } from '../features/overview/data/overview.demo';

export const AnalyticsPage: React.FC = () => {
  const telemetry = OVERVIEW_DEMO_DATA.environmentalTelemetry;

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase select-none">
            Hydro-Geotechnical Analytics
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-blue-600" />
            Hazard Analytics & Telemetry Trends
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            72h precipitation accumulation curves, geotechnical soil saturation indices, and empirical threshold models.
          </p>
        </div>
      </div>

      {/* Environmental Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-3.5 bg-white border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">24h Cumulative Rain</span>
            <CloudRain className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold font-mono-data text-slate-900">
            {telemetry.rain24h.toFixed(1)} <span className="text-xs font-normal text-slate-500">mm</span>
          </div>
          <div className="text-[10px] text-slate-400">IMD AWS Gauge Station 01</div>
        </Card>

        <Card className="p-3.5 bg-white border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">72h Cumulative Rain</span>
            <CloudRain className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-xl font-bold font-mono-data text-slate-900">
            {telemetry.rain72h.toFixed(1)} <span className="text-xs font-normal text-slate-500">mm</span>
          </div>
          <div className="text-[10px] text-slate-400">72h Precipitation Cycle</div>
        </Card>

        <Card className="p-3.5 bg-white border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Peak Soil Saturation</span>
            <Droplets className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold font-mono-data text-slate-900">
            {telemetry.maxSoilMoisturePercentage.toFixed(1)}%
          </div>
          <div className="text-[10px] text-red-600 font-semibold">Exceeds Pore Pressure Line</div>
        </Card>

        <Card className="p-3.5 bg-white border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Max Slope Angle</span>
            <Mountain className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-mono-data text-slate-900">
            {telemetry.maxSlopeDegrees.toFixed(1)}°
          </div>
          <div className="text-[10px] text-slate-400">Vellarimala High Ridge</div>
        </Card>
      </div>

      {/* Main 72h Trend Visualization */}
      <RiskTrendCard data={OVERVIEW_DEMO_DATA.riskTrend} />
    </div>
  );
};
