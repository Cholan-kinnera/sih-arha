import React from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip as LeafletTooltip, useMap } from 'react-leaflet';
import { RotateCcw, Plus, Minus, Layers } from 'lucide-react';
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

const DEFAULT_CENTER: [number, number] = [11.55, 76.12];
const DEFAULT_ZOOM = 11;

// Helper component for map control buttons
const MapController: React.FC<{
  onReset: () => void;
}> = ({ onReset }) => {
  const map = useMap();

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-[6px] border border-slate-200 shadow-sm">
      <IconButton
        aria-label="Zoom In"
        size="sm"
        onClick={() => map.zoomIn()}
        className="w-8 h-8 text-slate-700 hover:text-slate-900"
      >
        <Plus className="w-4 h-4" />
      </IconButton>
      <IconButton
        aria-label="Zoom Out"
        size="sm"
        onClick={() => map.zoomOut()}
        className="w-8 h-8 text-slate-700 hover:text-slate-900"
      >
        <Minus className="w-4 h-4" />
      </IconButton>
      <div className="h-[1px] bg-slate-200 my-0.5" />
      <IconButton
        aria-label="Reset Map Extent"
        size="sm"
        onClick={() => {
          map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
          onReset();
        }}
        className="w-8 h-8 text-slate-700 hover:text-slate-900"
      >
        <RotateCcw className="w-3.5 h-3.5" />
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
        fillOpacity: 0.65,
      };
    }

    return {
      color: config.colorHex,
      weight: severity === 'CRITICAL' ? 2.5 : 1.5,
      fillColor: config.colorHex,
      fillOpacity: severity === 'CRITICAL' ? 0.55 : severity === 'HIGH' ? 0.45 : 0.35,
    };
  };

  return (
    <div className="relative w-full h-[460px] lg:h-[520px] rounded-[8px] overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        zoomControl={false}
        className="w-full h-full"
      >
        {/* CartoDB Positron Clean Basemap */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={18}
        />

        <MapController onReset={() => onSelectZone(null)} />

        {/* Monitored Catchment Polygons */}
        {zones.map((zone) => {
          const isSelected = selectedZone?.id === zone.id;
          // Leaflet expects [lat, lng], while GeoJSON stores [lng, lat]
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

      {/* Floating Spatial Badge: Basin Sector */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-[6px] border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
        <Layers className="w-3.5 h-3.5 text-blue-600" />
        <span>Wayanad Basin Sector</span>
      </div>

      {/* Floating Spatial Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-[6px] border border-slate-200 shadow-sm flex items-center gap-3 text-xs select-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Legend</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span className="text-slate-700 font-medium text-[11px]">Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-700 font-medium text-[11px]">Mod</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span className="text-slate-700 font-medium text-[11px]">High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
          <span className="text-slate-700 font-medium text-[11px]">Critical</span>
        </div>
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
