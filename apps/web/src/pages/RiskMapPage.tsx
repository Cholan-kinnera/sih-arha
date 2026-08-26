import React from 'react';
import { Map } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { RiskSeverityBadge } from '../components/risk/RiskSeverityBadge';

export const RiskMapPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-600" />
            Interactive Risk Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Geospatial hazard zoning, terrain slopes, and real-time hazard polygons.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RiskSeverityBadge severity="HIGH" score={0.72} />
        </div>
      </div>

      <Card className="p-8 text-center bg-white border-slate-200 shadow-sm">
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Geospatial Map Workspace</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Geospatial layers, slope contours, sensor telemetry pins, and zone inspection panels will display within this viewport.
          </p>
        </div>
      </Card>
    </div>
  );
};
