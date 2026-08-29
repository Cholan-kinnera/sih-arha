/**
 * Robust WebSocket Client Manager for Real-Time Telemetry & Dynamic Risk Streaming
 */

import { getWebSocketUrl } from './config';
import type { WebSocketTelemetryMessage } from './types';

export type SocketConnectionState =
  | 'CONNECTING'
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'ERROR'
  | 'RECONNECTING'
  | 'OFFLINE';

export type MessageListener = (message: WebSocketTelemetryMessage) => void;
export type StatusListener = (status: SocketConnectionState) => void;

class TelemetrySocketManager {
  private socket: WebSocket | null = null;
  private status: SocketConnectionState = 'DISCONNECTED';
  private messageListeners = new Set<MessageListener>();
  private statusListeners = new Set<StatusListener>();

  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 10;
  private readonly initialBackoffMs = 1000;
  private readonly maxBackoffMs = 30000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private isManuallyClosed = false;

  public get connectionStatus(): SocketConnectionState {
    return this.status;
  }

  private setStatus(newStatus: SocketConnectionState): void {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.statusListeners.forEach((listener) => {
        try {
          listener(newStatus);
        } catch (err) {
          console.error('[TelemetrySocket] Error in status listener:', err);
        }
      });
    }
  }

  public connect(): void {
    if (typeof window === 'undefined' || typeof WebSocket === 'undefined') {
      return;
    }

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isManuallyClosed = false;
    this.setStatus('CONNECTING');

    const wsUrl = getWebSocketUrl('/api/v1/ws/telemetry');

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this.setStatus('CONNECTED');
        this.startHeartbeat();
      };

      this.socket.onmessage = (event: MessageEvent) => {
        if (typeof event.data === 'string') {
          if (event.data === 'pong' || event.data === 'ping') {
            return;
          }

          try {
            const parsed = JSON.parse(event.data) as WebSocketTelemetryMessage;
            this.messageListeners.forEach((listener) => {
              try {
                listener(parsed);
              } catch (err) {
                console.error('[TelemetrySocket] Error in message listener:', err);
              }
            });
          } catch (err) {
            console.warn('[TelemetrySocket] Received malformed message:', event.data, err);
          }
        }
      };

      this.socket.onerror = (event: Event) => {
        console.warn('[TelemetrySocket] Connection encountered error:', event);
        this.setStatus('ERROR');
      };

      this.socket.onclose = () => {
        this.stopHeartbeat();
        this.setStatus('DISCONNECTED');
        this.socket = null;

        if (!this.isManuallyClosed) {
          this.scheduleReconnect();
        }
      };
    } catch (err) {
      console.warn('[TelemetrySocket] Failed to establish connection:', err);
      this.setStatus('ERROR');
      this.scheduleReconnect();
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        try {
          this.socket.send('ping');
        } catch {
          // ignore
        }
      }
    }, 25000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('[TelemetrySocket] Reached maximum reconnection attempts. Giving up until manual reconnect.');
      return;
    }

    const backoff = Math.min(
      this.initialBackoffMs * Math.pow(1.5, this.reconnectAttempts),
      this.maxBackoffMs
    );
    this.reconnectAttempts += 1;

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, backoff);
  }

  public reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }

  public disconnect(): void {
    this.isManuallyClosed = true;
    this.stopHeartbeat();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      try {
        this.socket.close();
      } catch {
        // ignore
      }
      this.socket = null;
    }
    this.setStatus('DISCONNECTED');
  }

  public subscribe(listener: MessageListener): () => void {
    this.messageListeners.add(listener);
    if (this.status === 'DISCONNECTED') {
      this.connect();
    }
    return () => {
      this.messageListeners.delete(listener);
    };
  }

  public onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => {
      this.statusListeners.delete(listener);
    };
  }
}

export const telemetrySocket = new TelemetrySocketManager();
