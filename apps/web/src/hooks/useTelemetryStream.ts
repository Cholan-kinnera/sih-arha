/**
 * React Hook for Real-Time WebSocket Telemetry Streaming
 */

import { useEffect, useState, useCallback } from 'react';
import {
  telemetrySocket,
  type SocketConnectionState,
  type WebSocketTelemetryMessage,
} from '../lib/api';
import { useRealtimeStore } from '../stores/useRealtimeStore';

export interface UseTelemetryStreamReturn {
  connectionState: SocketConnectionState;
  latestTelemetry: WebSocketTelemetryMessage | null;
  latestRisk: {
    zone_id: string;
    dynamic_risk_score: number;
    severity_level: string;
  } | null;
  latestAlert: {
    alert_triggered: boolean;
    zone_id: string;
  } | null;
  lastUpdated: string | null;
  reconnect: () => void;
  disconnect: () => void;
}

export function useTelemetryStream(): UseTelemetryStreamReturn {
  const [connectionState, setLocalConnectionState] = useState<SocketConnectionState>(
    telemetrySocket.connectionStatus
  );
  const [latestTelemetry, setLatestTelemetry] = useState<WebSocketTelemetryMessage | null>(null);

  const setStoreConnectionState = useRealtimeStore((s) => s.setConnectionState);
  const handleLiveTelemetryMessage = useRealtimeStore((s) => s.handleLiveTelemetryMessage);
  const lastUpdated = useRealtimeStore((s) => s.lastTelemetryTimestamp);

  useEffect(() => {
    // 1. Subscribe to connection status changes
    const unsubStatus = telemetrySocket.onStatusChange((status) => {
      setLocalConnectionState(status);
      setStoreConnectionState(status);
    });

    // 2. Subscribe to incoming telemetry messages
    const unsubMessages = telemetrySocket.subscribe((msg: WebSocketTelemetryMessage) => {
      setLatestTelemetry(msg);
      handleLiveTelemetryMessage(msg);
    });

    return () => {
      unsubStatus();
      unsubMessages();
    };
  }, [setStoreConnectionState, handleLiveTelemetryMessage]);

  const reconnect = useCallback(() => {
    telemetrySocket.reconnect();
  }, []);

  const disconnect = useCallback(() => {
    telemetrySocket.disconnect();
  }, []);

  const latestRisk = latestTelemetry?.dynamic_risk_score !== undefined && latestTelemetry?.dynamic_risk_score !== null && latestTelemetry?.severity_level
    ? {
        zone_id: latestTelemetry.zone_id,
        dynamic_risk_score: latestTelemetry.dynamic_risk_score,
        severity_level: String(latestTelemetry.severity_level),
      }
    : null;

  const latestAlert = latestTelemetry?.alert_triggered !== undefined
    ? {
        alert_triggered: Boolean(latestTelemetry.alert_triggered),
        zone_id: latestTelemetry.zone_id,
      }
    : null;

  return {
    connectionState,
    latestTelemetry,
    latestRisk,
    latestAlert,
    lastUpdated,
    reconnect,
    disconnect,
  };
}
