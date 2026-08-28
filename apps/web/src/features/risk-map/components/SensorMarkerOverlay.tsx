import React from 'react';
import { Marker, Tooltip as LeafletTooltip } from 'react-leaflet';
import L from 'leaflet';
import type { SensorStation, HistoricalScarPoint } from '../types/risk-map.types';

export interface SensorMarkerOverlayProps {
  sensors: SensorStation[];
  scars: HistoricalScarPoint[];
  showSensors: boolean;
  showScars: boolean;
}

// Custom Leaflet DivIcon for AWS rainfall sensors
const createSensorIcon = (type: string) => {
  const isAws = type === 'IMD_AWS';
  const colorClass = isAws ? 'bg-blue-600' : 'bg-indigo-600';
  return L.divIcon({
    className: 'custom-sensor-icon',
    html: `<div class="w-6 h-6 rounded-full ${colorClass} text-white flex items-center justify-center shadow-md border-2 border-white text-[10px] font-bold">
      ${isAws ? 'AWS' : 'SOIL'}
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Custom Leaflet DivIcon for historical landslide scars
const createScarIcon = (severity: string) => {
  const colorClass = severity === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-600';
  return L.divIcon({
    className: 'custom-scar-icon',
    html: `<div class="w-5 h-5 rounded-md ${colorClass} text-white flex items-center justify-center shadow-sm border-2 border-white text-[9px] font-bold">
      ▲
    </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

export const SensorMarkerOverlay: React.FC<SensorMarkerOverlayProps> = ({
  sensors,
  scars,
  showSensors,
  showScars,
}) => {
  return (
    <>
      {/* Sensor Station Markers */}
      {showSensors &&
        sensors.map((sensor) => (
          <Marker
            key={sensor.id}
            position={[sensor.latitude, sensor.longitude]}
            icon={createSensorIcon(sensor.type)}
          >
            <LeafletTooltip direction="top" opacity={0.95} sticky>
              <div className="p-1 text-slate-900 font-sans">
                <div className="text-[10px] font-mono-data text-blue-600 font-bold uppercase">
                  {sensor.id} · {sensor.type}
                </div>
                <div className="text-xs font-bold">{sensor.name}</div>
                <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                  {sensor.reading_label}: <span className="font-mono-data font-bold text-slate-900">{sensor.reading_value}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono-data mt-0.5">
                  Status: {sensor.status} ({sensor.last_updated})
                </div>
              </div>
            </LeafletTooltip>
          </Marker>
        ))}

      {/* Historical Landslide Scar Markers */}
      {showScars &&
        scars.map((scar) => (
          <Marker
            key={scar.id}
            position={[scar.latitude, scar.longitude]}
            icon={createScarIcon(scar.severity)}
          >
            <LeafletTooltip direction="top" opacity={0.95} sticky>
              <div className="p-1 text-slate-900 font-sans max-w-[200px]">
                <div className="text-[10px] font-mono-data text-red-600 font-bold uppercase">
                  {scar.id} · {scar.year}
                </div>
                <div className="text-xs font-bold">{scar.name}</div>
                <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                  Trigger: <span className="font-mono-data font-bold text-slate-900">{scar.trigger_rainfall_mm} mm</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono-data mt-0.5">
                  Type: {scar.incident_type} ({scar.casualties} casualties)
                </div>
              </div>
            </LeafletTooltip>
          </Marker>
        ))}
    </>
  );
};
