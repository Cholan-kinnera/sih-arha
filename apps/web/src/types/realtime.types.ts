/**
 * Realtime and WebSocket types for LEWS
 * Authoritative specification: docs/PRODUCT_REQUIREMENTS.md
 */

import type { Alert, SensorReading, SeverityLevel } from './domain.types';

export type ConnectionState = 'CONNECTED' | 'RECONNECTING' | 'OFFLINE';

export type ScenarioPreset = 'DRY_BASELINE' | 'MONSOON_SHOWERS' | 'FLASH_CLOUDBURST' | 'POST_STORM_DRAINAGE';

export interface TelemetryPacket {
  type: 'TELEMETRY_UPDATE';
  timestamp: string;
  zone_id: string;
  reading: SensorReading;
  calculated_score: number;
  severity: SeverityLevel;
  confidence: number;
}

export interface AlertEventPacket {
  type: 'ALERT_TRIGGERED' | 'ALERT_ACKNOWLEDGED' | 'ALERT_RESOLVED';
  timestamp: string;
  alert: Alert;
}

export interface SystemStatusPacket {
  type: 'SYSTEM_STATUS';
  connection_state: ConnectionState;
  simulation_mode: boolean;
  active_scenario?: ScenarioPreset;
  connected_clients: number;
  last_heartbeat: string;
}

export type WebSocketMessage = TelemetryPacket | AlertEventPacket | SystemStatusPacket;
