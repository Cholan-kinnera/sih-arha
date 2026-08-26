import { create } from 'zustand';
import type { ConnectionState, ScenarioPreset } from '../types/realtime.types';

interface RealtimeState {
  connectionState: ConnectionState;
  simulationMode: boolean;
  activeScenario: ScenarioPreset;
  lastTelemetryTimestamp: string | null;
  activeCriticalAlertCount: number;

  // Actions
  setConnectionState: (state: ConnectionState) => void;
  setSimulationMode: (active: boolean) => void;
  setActiveScenario: (scenario: ScenarioPreset) => void;
  setLastTelemetryTimestamp: (timestamp: string) => void;
  setActiveCriticalAlertCount: (count: number) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  connectionState: 'CONNECTED',
  simulationMode: true,
  activeScenario: 'FLASH_CLOUDBURST',
  lastTelemetryTimestamp: new Date().toISOString(),
  activeCriticalAlertCount: 2,

  setConnectionState: (connectionState) => set({ connectionState }),
  setSimulationMode: (simulationMode) => set({ simulationMode }),
  setActiveScenario: (activeScenario) => set({ activeScenario }),
  setLastTelemetryTimestamp: (lastTelemetryTimestamp) => set({ lastTelemetryTimestamp }),
  setActiveCriticalAlertCount: (activeCriticalAlertCount) => set({ activeCriticalAlertCount }),
}));
