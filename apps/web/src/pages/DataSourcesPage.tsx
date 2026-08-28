import React from 'react';
import { Database, Radio } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProvenanceBadge } from '../components/data/ProvenanceBadge';

export const DataSourcesPage: React.FC = () => {
  const sources = [
    {
      id: 'DS-01',
      name: 'IMD Automatic Weather Station (AWS) Network',
      type: 'Realtime Telemetry',
      provider: 'India Meteorological Department',
      frequency: 'Every 15 minutes',
      status: 'CONNECTED',
    },
    {
      id: 'DS-02',
      name: 'GSI National Landslide Susceptibility Map (NLSM)',
      type: 'Geological Layer',
      provider: 'Geological Survey of India',
      frequency: 'Static / Quarterly',
      status: 'CONNECTED',
    },
    {
      id: 'DS-03',
      name: 'CartoDB / OpenStreetMap Elevation Mesh',
      type: 'Geospatial DEM',
      provider: 'OpenStreetMap & Carto',
      frequency: 'Static',
      status: 'CONNECTED',
    },
    {
      id: 'DS-04',
      name: 'In-Situ Soil Pore Pressure Probe Array',
      type: 'Geotechnical Sensors',
      provider: 'State Disaster Management Authority (SDMA)',
      frequency: 'Continuous Stream',
      status: 'CONNECTED',
    },
  ];

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase select-none">
            Data Governance & Provenance
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Data Sources & Lineage Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Data lineage, spatial resolutions, update frequencies, and provider status registry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge type="SIMULATED" />
          <Badge variant="success" size="sm">
            4 / 4 Feeds Active
          </Badge>
        </div>
      </div>

      {/* Sources Table */}
      <Card className="p-0 bg-white border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">Source ID & Dataset Name</th>
                <th className="py-2.5 px-3">Data Type</th>
                <th className="py-2.5 px-3">Authoritative Publisher</th>
                <th className="py-2.5 px-3">Update Cycle</th>
                <th className="py-2.5 px-3 text-right">Connection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sources.map((src) => (
                <tr key={src.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{src.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono-data font-semibold">{src.id}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{src.type}</td>
                  <td className="py-3 px-3 text-slate-600">{src.provider}</td>
                  <td className="py-3 px-3 font-mono-data text-slate-500 text-[11px]">{src.frequency}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                      {src.status}
                    </span>
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
