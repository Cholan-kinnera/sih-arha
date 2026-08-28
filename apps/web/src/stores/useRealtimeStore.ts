import { create } from 'zustand';
import type { SocketConnectionState, WebSocketTelemetryMessage } from '../lib/api';

export interface LiveZoneRiskUpdate {
  zone_id: string;
  dynamic_risk_score: number;
  severity_level: string;
  timestamp_utc: string;
  measurement_type: string;
  value: number;
  unit: string;
}

interface RealtimeState {
  connectionState: SocketConnectionState;
  simulationMode: boolean;
  activeScenario: string;
  isBackendLive: boolean;
  lastTelemetryTimestamp: string | null;
  activeCriticalAlertCount: number;
  latestTelemetryMessage: WebSocketTelemetryMessage | null;
  liveZoneRisks: Record<string, LiveZoneRiskUpdate>;

  // Actions
  setConnectionState: (state: SocketConnectionState) => void;
  setSimulationMode: (active: boolean) => void;
  setActiveScenario: (scenario: string) => void;
  setIsBackendLive: (live: boolean) => void;
  setLastTelemetryTimestamp: (timestamp: string) => void;
  setActiveCriticalAlertCount: (count: number) => void;
  handleLiveTelemetryMessage: (message: WebSocketTelemetryMessage) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  connectionState: 'DISCONNECTED',
  simulationMode: false,
  activeScenario: 'MONSOON_SURGE',
  isBackendLive: true,
  lastTelemetryTimestamp: null,
  activeCriticalAlertCount: 0,
  latestTelemetryMessage: null,
  liveZoneRisks: {},

  setConnectionState: (connectionState) => set({ connectionState }),
  setSimulationMode: (simulationMode) => set({ simulationMode }),
  setActiveScenario: (activeScenario) => set({ activeScenario }),
  setIsBackendLive: (isBackendLive) => set({ isBackendLive }),
  setLastTelemetryTimestamp: (lastTelemetryTimestamp) => set({ lastTelemetryTimestamp }),
  setActiveCriticalAlertCount: (activeCriticalAlertCount) => set({ activeCriticalAlertCount }),

  handleLiveTelemetryMessage: (message: WebSocketTelemetryMessage) => {
    set((state) => {
      const updatedRisks = { ...state.liveZoneRisks };

      if (message.dynamic_risk_score !== undefined && message.dynamic_risk_score !== null && message.severity_level) {
        updatedRisks[message.zone_id] = {
          zone_id: message.zone_id,
          dynamic_risk_score: message.dynamic_risk_score,
          severity_level: String(message.severity_level),
          timestamp_utc: message.timestamp_utc,
          measurement_type: message.measurement_type,
          value: message.value,
          unit: message.unit,
        };
      }

      let criticalCount = state.activeCriticalAlertCount;
      if (message.alert_triggered && message.severity_level === 'CRITICAL') {
        criticalCount += 1;
      }

      return {
        latestTelemetryMessage: message,
        lastTelemetryTimestamp: message.timestamp_utc || new Date().toISOString(),
        liveZoneRisks: updatedRisks,
        activeCriticalAlertCount: criticalCount,
      };
    });
  },
}));
