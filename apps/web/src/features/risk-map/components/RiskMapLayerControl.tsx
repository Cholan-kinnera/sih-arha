import React, { useState } from 'react';
import { Layers, Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { LayerVisibilityState } from '../types/risk-map.types';

export interface RiskMapLayerControlProps {
  layers: LayerVisibilityState;
  onToggleLayer: (layerKey: keyof LayerVisibilityState) => void;
}

export const RiskMapLayerControl: React.FC<RiskMapLayerControlProps> = ({
  layers,
  onToggleLayer,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

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
    <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-[8px] p-2.5 shadow-md w-60 select-none">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider focus-visible:outline-2 focus-visible:outline-blue-600 rounded p-0.5"
      >
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>GIS Layers</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-1 mt-2 pt-2 border-t border-slate-100">
          {layerOptions.map((opt) => {
            const isActive = layers[opt.key];
            return (
              <button
                key={opt.key}
                type="button"
                role="switch"
                aria-checked={isActive}
                onClick={() => onToggleLayer(opt.key)}
                className="w-full flex items-start gap-2 p-1.5 rounded-[6px] hover:bg-slate-50 transition-colors text-left group focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center mt-0.5 transition-colors shrink-0 ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                  }`}
                >
                  {isActive && <Check className="w-2.5 h-2.5 stroke-[3]" />}
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
      )}
    </div>
  );
};
