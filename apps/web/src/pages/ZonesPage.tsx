import React from 'react';
import { Layers } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const ZonesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Monitored Zones Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Catchment slope profiles, soil taxonomies, and localized telemetry metrics.
          </p>
        </div>
      </div>

      <Card className="p-8 text-center bg-white border-slate-200 shadow-sm">
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Zone Inventory Directory</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Detailed micro-catchment sector profiles, historical incident records, and geotechnical attributes are indexed here.
          </p>
        </div>
      </Card>
    </div>
  );
};
