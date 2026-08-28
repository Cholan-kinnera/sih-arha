import React from 'react';
import { BellRing, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { RiskSeverityBadge } from '../components/risk/RiskSeverityBadge';
import { OVERVIEW_DEMO_DATA } from '../features/overview/data/overview.demo';
import { formatRelativeTime } from '../lib/date-utils';

export const AlertsPage: React.FC = () => {
  const alerts = OVERVIEW_DEMO_DATA.alerts;
  const activeAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-red-600 uppercase select-none">
            Operational Hazard Triage
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BellRing className="w-5 h-5 text-red-600" />
            Alert Operations Console
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time hazard warning queue, acknowledgment audit logs, and operator triage workflows.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="danger" size="sm">
            {activeAlertsCount} Active Hazard Alerts
          </Badge>
        </div>
      </div>

      {/* Alerts Table */}
      <Card className="p-0 bg-white border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">Alert ID & Zone</th>
                <th className="py-2.5 px-3">Hazard Threshold Reason</th>
                <th className="py-2.5 px-3 text-center">Timestamp</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{alert.zone_name ?? alert.zone_id}</div>
                    <div className="text-[10px] text-slate-400 font-mono-data font-semibold">
                      {alert.id} · {alert.zone_id}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 max-w-md leading-snug">
                    {alert.reason}
                  </td>
                  <td className="py-3 px-3 text-center font-mono-data text-slate-500 text-[11px] whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formatRelativeTime(alert.timestamp)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {alert.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        <ShieldAlert className="w-3 h-3" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        <CheckCircle2 className="w-3 h-3 text-slate-500" />
                        ACKNOWLEDGED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <RiskSeverityBadge severity={alert.severity} score={alert.risk_score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
