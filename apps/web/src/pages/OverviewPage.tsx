import React from 'react';
import { LayoutDashboard, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { MetricCard } from '../components/ui/MetricCard';
import { RiskSeverityBadge } from '../components/risk/RiskSeverityBadge';
import { Card } from '../components/ui/Card';

export const OverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            Overview Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            District-wide real-time situation awareness and emergency triage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Current Status:</span>
          <RiskSeverityBadge severity="CRITICAL" score={0.84} />
        </div>
      </div>

      {/* Level 1: Metric KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Monitored Zones"
          value="12"
          secondaryText={
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />
              All 12 telemetry nodes active
            </>
          }
        />
        <MetricCard
          title="Regional Avg Risk"
          value="0.42"
          severity="MODERATE"
          secondaryText={
            <>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
              +0.12 in last 3 hours
            </>
          }
        />
        <MetricCard
          title="Critical Alerts"
          value="2"
          severity="CRITICAL"
          secondaryText={
            <>
              <AlertCircle className="w-3.5 h-3.5 text-red-600 inline mr-1" />
              Immediate response required
            </>
          }
        />
        <MetricCard
          title="24h Peak Rain"
          value="184.2 mm"
          severity="HIGH"
          secondaryText="Zone 01 (Meppadi North)"
        />
      </div>

      {/* Overview Situation Summary Panel */}
      <Card className="p-6 bg-white border-slate-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
            Operational Situation Summary
          </h2>
          <span className="text-xs font-mono-data text-slate-400">Telemetry Cycle: 30s</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Monitored micro-catchments in the Wayanad Basin indicate elevated slope instability along northern drainage sectors. High cumulative rainfall and rising soil moisture saturation are the primary drivers under current observation conditions.
        </p>
      </Card>
    </div>
  );
};
