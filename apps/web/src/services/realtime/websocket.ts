import { envConfig } from '../../config/env.config';
import { useRealtimeStore } from '../../stores/useRealtimeStore';
import { RealtimeConnectionManager } from './connectionManager';
import type { RealtimeListener, WebSocketMessage } from './types';

class RealtimeService {
  private socket: WebSocket | null = null;
  private connectionManager = new RealtimeConnectionManager();
  private listeners: Set<RealtimeListener<WebSocketMessage>> = new Set();
  private isExplicitlyClosed = false;

  public connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isExplicitlyClosed = false;

    try {
      this.socket = new WebSocket(envConfig.WS_BASE_URL);

      this.socket.onopen = () => {
        this.connectionManager.handleConnected();
      };

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          useRealtimeStore.getState().setLastTelemetryTimestamp(new Date().toISOString());

          if (message.type === 'ALERT_TRIGGERED' && message.alert.severity === 'CRITICAL') {
            const current = useRealtimeStore.getState().activeCriticalAlertCount;
            useRealtimeStore.getState().setActiveCriticalAlertCount(current + 1);
          }

          this.listeners.forEach((listener) => listener(message));
        } catch {
          // Ignore malformed incoming packets
        }
      };

      this.socket.onclose = () => {
        if (!this.isExplicitlyClosed) {
          this.connectionManager.handleDisconnected(() => this.connect());
        }
      };

      this.socket.onerror = () => {
        if (!this.isExplicitlyClosed) {
          this.connectionManager.handleDisconnected(() => this.connect());
        }
      };
    } catch {
      this.connectionManager.handleDisconnected(() => this.connect());
    }
  }

  public disconnect(): void {
    this.isExplicitlyClosed = true;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connectionManager.reset();
    useRealtimeStore.getState().setConnectionState('OFFLINE');
  }

  public subscribe(listener: RealtimeListener<WebSocketMessage>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const realtimeService = new RealtimeService();
