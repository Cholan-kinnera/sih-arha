import React from 'react';
import { Layers, Check } from 'lucide-react';
import type { LayerVisibilityState } from '../types/risk-map.types';

export interface RiskMapLayerControlProps {
  layers: LayerVisibilityState;
  onToggleLayer: (layerKey: keyof LayerVisibilityState) => void;
}

export const RiskMapLayerControl: React.FC<RiskMapLayerControlProps> = ({
  layers,
  onToggleLayer,
}) => {
  const layerOptions: { key: keyof LayerVisibilityState; label: string; description: string }[] = [
    {
      key: 'hazardZones',
      label: 'Hazard Zones',
      description: 'Geospatial susceptibility polygons',
    },
    {
      key: 'rainfallMesh',
      label: 'Rainfall Mesh',
      description: 'IMD precipitation accumulation heat layer',
    },
    {
      key: 'historicalScars',
      label: 'Historical Landslides',
      description: 'GSI historical scar points',
    },
    {
      key: 'sensorStations',
      label: 'Sensor Stations',
      description: 'AWS stations & soil moisture probes',
    },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-[8px] p-3 shadow-md w-64 select-none">
      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2">
        <Layers className="w-3.5 h-3.5 text-blue-600" />
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Geospatial Layers
        </span>
      </div>

      <div className="space-y-1.5">
        {layerOptions.map((opt) => {
          const isActive = layers[opt.key];
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onToggleLayer(opt.key)}
              className="w-full flex items-start gap-2.5 p-1.5 rounded-[6px] hover:bg-slate-50 transition-colors text-left group focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <div
                className={`w-4 h-4 rounded-[4px] border flex items-center justify-center mt-0.5 transition-colors shrink-0 ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-300 bg-white group-hover:border-slate-400'
                }`}
              >
                {isActive && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {opt.label}
                </div>
                <div className="text-[10px] text-slate-400 leading-snug truncate">
                  {opt.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
