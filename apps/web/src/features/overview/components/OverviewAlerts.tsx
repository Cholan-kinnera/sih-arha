import React from 'react';
import { Link } from 'react-router-dom';
import { BellRing, ArrowRight, ShieldAlert, TriangleAlert, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { formatRelativeTime } from '../../../lib/date-utils';
import type { Alert, SeverityLevel } from '../../../types/domain.types';

export interface OverviewAlertsProps {
  alerts: Alert[];
  onSelectZoneId?: (zoneId: string) => void;
}

const SEVERITY_WEIGHT: Record<SeverityLevel, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MODERATE: 2,
  LOW: 1,
};

export const OverviewAlerts: React.FC<OverviewAlertsProps> = ({ alerts, onSelectZoneId }) => {
  const activeCriticalCount = alerts.filter((a) => a.status === 'ACTIVE' && a.severity === 'CRITICAL').length;
  const activeHighCount = alerts.filter((a) => a.status === 'ACTIVE' && a.severity === 'HIGH').length;

  const sortedAlerts = [...alerts]
    .sort((a, b) => {
      const weightDiff = SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity];
      if (weightDiff !== 0) return weightDiff;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    })
    .slice(0, 4);

  const getAlertIcon = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />;
      case 'HIGH':
        return <TriangleAlert className="w-3.5 h-3.5 text-orange-600 shrink-0" />;
      case 'MODERATE':
        return <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case 'LOW':
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
    }
  };

  const getSeverityBorder = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return 'critical';
      case 'HIGH':
        return 'high';
      case 'MODERATE':
        return 'moderate';
      case 'LOW':
      default:
        return 'low';
    }
  };

  return (
    <div className="flex flex-col h-[380px] lg:h-[420px] bg-white rounded-[8px] border border-slate-200 shadow-2xs p-3.5">
      {/* Panel Header with Compact Triage Counts */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <BellRing className="w-4 h-4 text-red-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Active Alerts</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono-data font-semibold">
          <Badge variant="danger" size="sm">
            {activeCriticalCount} Critical
          </Badge>
          {activeHighCount > 0 && (
            <Badge variant="warning" size="sm">
              {activeHighCount} High
            </Badge>
          )}
        </div>
      </div>

      {/* Alert Feed List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {sortedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />
            <p className="text-xs font-semibold text-slate-700">No active alerts require attention.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">All monitored catchments within baseline limits.</p>
          </div>
        ) : (
          sortedAlerts.map((alert) => (
            <Card
              key={alert.id}
              variant="alert"
              severityBorder={getSeverityBorder(alert.severity)}
              className="p-2.5 bg-slate-50/60 hover:bg-slate-50 border-slate-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <button
                  type="button"
                  onClick={() => onSelectZoneId?.(alert.zone_id)}
                  className="text-xs font-bold text-slate-900 hover:text-blue-600 text-left truncate transition-colors"
                >
                  {alert.zone_name ?? alert.zone_id}
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  {getAlertIcon(alert.severity)}
                  <span className="text-[11px] font-bold font-mono-data text-slate-900">
                    {alert.risk_score.toFixed(2)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-tight line-clamp-2 mb-1.5">
                {alert.reason}
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-data">
                <span>{formatRelativeTime(alert.timestamp)}</span>
                <span
                  className={
                    alert.status === 'ACTIVE'
                      ? 'text-red-700 font-semibold uppercase'
                      : 'text-slate-500 font-medium'
                  }
                >
                  {alert.status}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Footer Navigation Action */}
      <div className="border-t border-slate-100 pt-2.5 mt-2 shrink-0">
        <Link
          to="/alerts"
          className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors p-0.5"
        >
          <span>View alert history & triage log →</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
