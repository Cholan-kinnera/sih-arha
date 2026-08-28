import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  MapPin,
  Eye,
  Check,
  Inbox,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { RiskSeverityBadge } from '../../../components/risk/RiskSeverityBadge';
import { formatRelativeTime } from '../../../lib/date-utils';
import type { AlertDetailed } from '../types/alerts.types';

export interface AlertsQueueTableProps {
  alerts: AlertDetailed[];
  onSelectAlert: (alert: AlertDetailed) => void;
  onAcknowledgeAlert: (alert: AlertDetailed) => void;
}

export const AlertsQueueTable: React.FC<AlertsQueueTableProps> = ({
  alerts,
  onSelectAlert,
  onAcknowledgeAlert,
}) => {
  if (alerts.length === 0) {
    return (
      <Card className="p-8 text-center bg-white border-slate-200 shadow-2xs">
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
            <Inbox className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No matching hazard alerts</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All monitored sectors are currently within baseline operational limits for the selected filter parameters.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 bg-white border-slate-200 shadow-2xs overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Alert ID & Severity</th>
              <th className="py-3 px-3">Affected Catchment Sector</th>
              <th className="py-3 px-3">Trigger Condition & Reason</th>
              <th className="py-3 px-3">Observed vs Threshold</th>
              <th className="py-3 px-3 text-center">Timestamp</th>
              <th className="py-3 px-3 text-center">Operational Status</th>
              <th className="py-3 px-4 text-right">Triage Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {alerts.map((alert) => {
              const isActive = alert.status === 'ACTIVE';

              return (
                <tr
                  key={alert.id}
                  className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${
                    isActive ? 'bg-red-50/20' : ''
                  }`}
                  onClick={() => onSelectAlert(alert)}
                >
                  {/* Alert ID & Severity */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono-data font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                        {alert.id}
                      </span>
                    </div>
                    <RiskSeverityBadge
                      severity={alert.severity}
                      score={alert.risk_score}
                    />
                  </td>

                  {/* Affected Sector */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {alert.zone_name ?? alert.zone_id}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono-data">
                      {alert.zone_id} · {alert.district}
                    </div>
                  </td>

                  {/* Trigger Condition & Reason */}
                  <td className="py-3 px-3 max-w-sm">
                    <div className="text-slate-800 font-semibold text-xs leading-snug line-clamp-1">
                      {alert.trigger_metric}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug mt-0.5">
                      {alert.reason}
                    </p>
                  </td>

                  {/* Observed vs Threshold */}
                  <td className="py-3 px-3 font-mono-data">
                    <div className="text-xs font-bold text-slate-900">
                      {alert.observed_value_text}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Limit: {alert.trigger_threshold_text}
                    </div>
                  </td>

                  {/* Timestamp */}
                  <td className="py-3 px-3 text-center font-mono-data text-slate-500 text-[11px] whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formatRelativeTime(alert.timestamp)}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3 text-center">
                    {alert.status === 'ACTIVE' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        <ShieldAlert className="w-3 h-3" />
                        ACTIVE
                      </span>
                    )}
                    {alert.status === 'ACKNOWLEDGED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ACKNOWLEDGED
                      </span>
                    )}
                    {alert.status === 'RESOLVED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        RESOLVED
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1.5">
                      {isActive && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onAcknowledgeAlert(alert)}
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                          className="text-[11px] h-7 px-2.5"
                        >
                          Acknowledge
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectAlert(alert)}
                        className="text-slate-600 hover:text-blue-600 text-[11px] h-7 px-2"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> Details
                      </Button>

                      <Link
                        to="/map"
                        className="inline-flex items-center justify-center w-7 h-7 rounded-[4px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 transition-colors"
                        title="View on Risk Map"
                        aria-label={`View ${alert.zone_name ?? alert.zone_id} on Risk Map`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
