import React from 'react';
import { BellRing } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const AlertsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BellRing className="w-5 h-5 text-red-600" />
            Alert Operations Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time hazard warning stream, acknowledgment audit logs, and escalation workflows.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="danger">2 Active Alerts</Badge>
        </div>
      </div>

      <Card className="p-8 text-center bg-white border-slate-200 shadow-sm">
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Alert Triage Feed</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Real-time hazard warnings, threshold breach notifications, and operator dispatch logs are managed in this queue.
          </p>
        </div>
      </Card>
    </div>
  );
};
