import React from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip as LeafletTooltip, useMap } from 'react-leaflet';
import { RotateCcw, Plus, Minus, Layers, Radio } from 'lucide-react';
import { IconButton } from '../../../components/ui/IconButton';
import { SEVERITY_CONFIGS } from '../../../lib/risk-semantics';
import { CompactZoneDrawer } from './CompactZoneDrawer';
import type { Zone } from '../../../types/domain.types';

export interface OverviewRiskMapProps {
  zones: Zone[];
  selectedZone: Zone | null;
  onSelectZone: (zone: Zone | null) => void;
  onViewZoneDetails?: (zoneId: string) => void;
}

const DEFAULT_CENTER: [number, number] = [26.15, 93.00];
const DEFAULT_ZOOM = 7;

// Helper component for map control buttons
const MapController: React.FC<{
  onReset: () => void;
}> = ({ onReset }) => {
  const map = useMap();

  return (
    <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 bg-white/95 backdrop-blur-md p-1 rounded-[6px] border border-slate-200 shadow-xs">
      <IconButton
        aria-label="Zoom In"
        size="sm"
        onClick={() => map.zoomIn()}
        className="w-7 h-7 text-slate-700 hover:text-slate-900"
      >
        <Plus className="w-3.5 h-3.5" />
      </IconButton>
      <IconButton
        aria-label="Zoom Out"
        size="sm"
        onClick={() => map.zoomOut()}
        className="w-7 h-7 text-slate-700 hover:text-slate-900"
      >
        <Minus className="w-3.5 h-3.5" />
      </IconButton>
      <div className="h-[1px] bg-slate-200 my-0.5" />
      <IconButton
        aria-label="Reset Map Extent"
        size="sm"
        onClick={() => {
          map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
          onReset();
        }}
        className="w-7 h-7 text-slate-700 hover:text-slate-900"
      >
        <RotateCcw className="w-3 h-3" />
      </IconButton>
    </div>
  );
};

export const OverviewRiskMap: React.FC<OverviewRiskMapProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  onViewZoneDetails,
}) => {
  const getPolygonStyle = (zone: Zone, isSelected: boolean) => {
    const severity = zone.current_severity ?? 'LOW';
    const config = SEVERITY_CONFIGS[severity];

    if (isSelected) {
      return {
        color: '#2563eb',
        weight: 3.5,
        fillColor: config.colorHex,
        fillOpacity: 0.70,
      };
    }

    return {
      color: config.colorHex,
      weight: severity === 'CRITICAL' ? 2.5 : 1.5,
      fillColor: config.colorHex,
      fillOpacity: severity === 'CRITICAL' ? 0.60 : severity === 'HIGH' ? 0.50 : 0.38,
    };
  };

  return (
    <div className="relative w-full h-[380px] lg:h-[420px] rounded-[8px] overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        zoomControl={false}
        className="w-full h-full"
      >
        {/* OpenStreetMap / Carto Light Basemap without API key requirement watermark */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={18}
        />

        <MapController onReset={() => onSelectZone(null)} />

        {/* Monitored Catchment Polygons */}
        {zones.map((zone) => {
          const isSelected = selectedZone?.id === zone.id;
          const positions = zone.geometry.coordinates[0]?.map(
            ([lng, lat]) => [lat, lng] as [number, number]
          ) ?? [];

          return (
            <Polygon
              key={zone.id}
              positions={positions}
              pathOptions={getPolygonStyle(zone, isSelected)}
              eventHandlers={{
                click: () => onSelectZone(zone),
              }}
            >
              <LeafletTooltip direction="top" opacity={0.95} sticky>
                <div className="p-1 text-slate-900 font-sans">
                  <div className="text-[10px] font-mono-data text-slate-500 font-bold uppercase">
                    {zone.id}
                  </div>
                  <div className="text-xs font-bold">{zone.name}</div>
                  <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                    Risk: <span className="font-mono-data font-bold">{zone.current_risk_score?.toFixed(2)}</span> ({zone.current_severity})
                  </div>
                </div>
              </LeafletTooltip>
            </Polygon>
          );
        })}
      </MapContainer>

      {/* Floating Spatial Badge: Basin Sector & Status */}
      <div className="absolute top-3 right-3 z-10 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-[6px] border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
        <Layers className="w-3.5 h-3.5 text-blue-600" />
        <span>North-Eastern Region (NER) Grid</span>
        <span className="h-3 w-[1px] bg-slate-200" />
        <span className="text-[11px] font-mono-data text-slate-500 font-normal">
          {zones.length} Sectors Active
        </span>
      </div>

      {/* Floating Spatial Legend (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-[6px] border border-slate-200 shadow-2xs flex items-center gap-3 text-xs select-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Legend</span>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span className="text-slate-700 font-medium text-[11px]">Low</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-700 font-medium text-[11px]">Mod</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span className="text-slate-700 font-medium text-[11px]">High</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
          <span className="text-slate-700 font-medium text-[11px]">Critical</span>
        </div>
      </div>

      {/* Floating Spatial Attribution & Freshness (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-10 hidden md:flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2 py-1 rounded-[6px] border border-slate-200 shadow-2xs text-[10px] font-mono-data text-slate-500">
        <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
        <span>GSI Terrain Mesh v2.4</span>
      </div>

      {/* Slide-over Compact Inspector Drawer when a Zone is selected */}
      <CompactZoneDrawer
        zone={selectedZone}
        onClose={() => onSelectZone(null)}
        onViewDetails={onViewZoneDetails}
      />
    </div>
  );
};
