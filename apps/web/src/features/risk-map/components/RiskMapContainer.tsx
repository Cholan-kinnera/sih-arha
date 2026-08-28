import React from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip as LeafletTooltip, useMap } from 'react-leaflet';
import { RotateCcw, Plus, Minus, Radio } from 'lucide-react';
import { IconButton } from '../../../components/ui/IconButton';
import { SEVERITY_CONFIGS } from '../../../lib/risk-semantics';
import { SensorMarkerOverlay } from './SensorMarkerOverlay';
import { RiskMapLayerControl } from './RiskMapLayerControl';
import { RiskMapLegend } from './RiskMapLegend';
import { DEMO_SENSORS, DEMO_HISTORICAL_SCARS, DEMO_RAINFALL_MESH } from '../data/risk-map.demo';
import type { LayerVisibilityState } from '../types/risk-map.types';
import type { Zone } from '../../../types/domain.types';

export interface RiskMapContainerProps {
  zones: Zone[];
  selectedZone: Zone | null;
  onSelectZone: (zone: Zone | null) => void;
  layers: LayerVisibilityState;
  onToggleLayer: (layerKey: keyof LayerVisibilityState) => void;
}

const DEFAULT_CENTER: [number, number] = [26.15, 93.00];
const DEFAULT_ZOOM = 7;

const MapController: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  const map = useMap();

  return (
    <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 bg-white/95 backdrop-blur-md p-1 rounded-[6px] border border-slate-200 shadow-xs">
      <IconButton
        aria-label="Zoom In Map View"
        size="sm"
        onClick={() => map.zoomIn()}
        className="w-7 h-7 text-slate-700 hover:text-slate-900"
      >
        <Plus className="w-3.5 h-3.5" />
      </IconButton>
      <IconButton
        aria-label="Zoom Out Map View"
        size="sm"
        onClick={() => map.zoomOut()}
        className="w-7 h-7 text-slate-700 hover:text-slate-900"
      >
        <Minus className="w-3.5 h-3.5" />
      </IconButton>
      <div className="h-[1px] bg-slate-200 my-0.5" />
      <IconButton
        aria-label="Reset Map Extent to Basin View"
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

export const RiskMapContainer: React.FC<RiskMapContainerProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  layers,
  onToggleLayer,
}) => {
  const getPolygonStyle = (zone: Zone, isSelected: boolean) => {
    const severity = zone.current_severity ?? 'LOW';
    const config = SEVERITY_CONFIGS[severity];

    if (isSelected) {
      return {
        color: '#2563eb',
        weight: 3.5,
        fillColor: config.colorHex,
        fillOpacity: 0.75,
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
    <div className="relative w-full h-[620px] lg:h-[680px] rounded-[8px] overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        zoomControl={false}
        className="w-full h-full"
      >
        {/* OpenStreetMap Vector Tile Layer without API watermarks */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={18}
        />

        <MapController onReset={() => onSelectZone(null)} />

        {/* 1. Rainfall Mesh Polygon Layer */}
        {layers.rainfallMesh &&
          DEMO_RAINFALL_MESH.map((mesh) => {
            const positions = mesh.coordinates[0]?.map(
              ([lng, lat]) => [lat, lng] as [number, number]
            ) ?? [];
            return (
              <Polygon
                key={mesh.id}
                positions={positions}
                pathOptions={{
                  color: '#3b82f6',
                  weight: 1,
                  fillColor: '#3b82f6',
                  fillOpacity: 0.12,
                  dashArray: '4 4',
                }}
              >
                <LeafletTooltip direction="center" opacity={0.9} sticky>
                  <div className="p-1 font-mono-data text-xs font-bold text-blue-900">
                    IMD Rainfall Heat Layer: {mesh.rainfall_24h_mm} mm ({mesh.intensity_level})
                  </div>
                </LeafletTooltip>
              </Polygon>
            );
          })}

        {/* 2. Hazard Sectors Polygon Layer */}
        {layers.hazardZones &&
          zones.map((zone) => {
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
                      {zone.id} · {zone.district}
                    </div>
                    <div className="text-xs font-bold">{zone.name}</div>
                    <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                      Risk Index:{' '}
                      <span className="font-mono-data font-bold">
                        {zone.current_risk_score?.toFixed(2)}
                      </span>{' '}
                      ({zone.current_severity})
                    </div>
                  </div>
                </LeafletTooltip>
              </Polygon>
            );
          })}

        {/* 3. Sensor Station & Historical Scar Marker Layer */}
        <SensorMarkerOverlay
          sensors={DEMO_SENSORS}
          scars={DEMO_HISTORICAL_SCARS}
          showSensors={layers.sensorStations}
          showScars={layers.historicalScars}
        />
      </MapContainer>

      {/* Floating Layer Control Panel (Top Right) */}
      <div className="absolute top-3 right-3 z-10 hidden sm:block">
        <RiskMapLayerControl layers={layers} onToggleLayer={onToggleLayer} />
      </div>

      {/* Floating Severity Legend (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:block">
        <RiskMapLegend />
      </div>

      {/* Floating Telemetry Stream Status (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-10 hidden md:flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-[6px] border border-slate-200 shadow-2xs text-[10px] font-mono-data text-slate-500">
        <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
        <span>GSI Terrain Mesh v2.4 · SIMULATED</span>
      </div>
    </div>
  );
};
