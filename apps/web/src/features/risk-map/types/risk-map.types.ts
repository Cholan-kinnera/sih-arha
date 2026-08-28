import type { SeverityLevel } from '../../../types/domain.types';

export interface LayerVisibilityState {
  hazardZones: boolean;
  rainfallMesh: boolean;
  historicalScars: boolean;
  sensorStations: boolean;
}

export type SensorType = 'IMD_AWS' | 'SOIL_PROBE' | 'PIEZOMETER';

export interface SensorStation {
  id: string;
  name: string;
  type: SensorType;
  zone_id: string;
  latitude: number;
  longitude: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';
  last_updated: string;
  battery_pct: number;
  reading_label: string;
  reading_value: string;
}

export interface HistoricalScarPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  year: number;
  incident_type: 'Debris Flow' | 'Rotational Slide' | 'Rockfall' | 'Mudslide';
  trigger_rainfall_mm: number;
  casualties: number;
  severity: SeverityLevel;
}

export interface RainfallMeshPolygon {
  id: string;
  rainfall_24h_mm: number;
  intensity_level: 'LIGHT' | 'MODERATE' | 'HEAVY' | 'EXTREME';
  coordinates: number[][][];
}

export interface CaineThresholdPoint {
  durationHours: number;
  currentIntensityMmHr: number;
  caineThresholdMmHr: number;
  label: string;
}

export interface RiskMapFilterState {
  searchQuery: string;
  selectedSeverity: SeverityLevel | 'ALL';
  minSlopeDegrees: number;
}
