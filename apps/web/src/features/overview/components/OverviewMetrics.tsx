import React from 'react';
import { MapPin, TrendingUp, TriangleAlert, CloudRain } from 'lucide-react';
import { RiskSeverityBadge } from '../../../components/risk/RiskSeverityBadge';
import type { OverviewKpiData } from '../types/overview.types';

export interface OverviewMetricsProps {
  kpis: OverviewKpiData;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({ kpis }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[8px] shadow-2xs overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
      {/* 1. Monitored Zones */}
      <div className="p-3.5 flex flex-col justify-between hover:bg-slate-50/50 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Monitored Zones
          </span>
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono-data text-slate-900 tracking-tight">
            {kpis.monitoredZonesCount}
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
            Active
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-medium mt-1 truncate">
          All monitored sectors transmitting
        </div>
      </div>

      {/* 2. Regional Risk */}
      <div className="p-3.5 flex flex-col justify-between hover:bg-slate-50/50 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Regional Risk
          </span>
          <TrendingUp className="w-3.5 h-3.5 text-orange-600 shrink-0" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold font-mono-data text-slate-900 tracking-tight">
            {kpis.regionalRiskScore.toFixed(2)}
          </span>
          <RiskSeverityBadge severity={kpis.regionalSeverity} showScore={false} />
        </div>
        <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
          <span className="font-mono-data text-orange-600 font-semibold">{kpis.regionalRiskTrendText}</span>
        </div>
      </div>

      {/* 3. Critical Alerts */}
      <div className="p-3.5 flex flex-col justify-between hover:bg-slate-50/50 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Critical Alerts
          </span>
          <TriangleAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono-data text-slate-900 tracking-tight">
            {kpis.criticalAlertsCount}
          </span>
          {kpis.unacknowledgedAlertsCount > 0 && (
            <span className="text-[11px] font-semibold text-red-700 bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
              {kpis.unacknowledgedAlertsCount} Unack
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400 font-medium mt-1 truncate">
          Requires immediate hazard triage
        </div>
      </div>

      {/* 4. 24h Peak Rainfall */}
      <div className="p-3.5 flex flex-col justify-between hover:bg-slate-50/50 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            24h Peak Rainfall
          </span>
          <CloudRain className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono-data text-slate-900 tracking-tight">
            {kpis.peakRainfall24h.toFixed(1)}
          </span>
          <span className="text-xs font-semibold text-slate-500 font-mono-data">mm</span>
        </div>
        <div className="text-[11px] text-slate-400 font-medium mt-1 truncate" title={kpis.peakRainfallZoneName}>
          {kpis.peakRainfallZoneName}
        </div>
      </div>
    </div>
  );
};
