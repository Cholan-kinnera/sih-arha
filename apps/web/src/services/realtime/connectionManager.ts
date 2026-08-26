import { useRealtimeStore } from '../../stores/useRealtimeStore';

export class RealtimeConnectionManager {
  private retryCount = 0;
  private maxRetries = 5;
  private baseDelayMs = 1000;
  private maxDelayMs = 15000;
  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;

  public handleConnected(): void {
    this.retryCount = 0;
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
    useRealtimeStore.getState().setConnectionState('CONNECTED');
  }

  public handleDisconnected(onReconnect: () => void): void {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      const delay = Math.min(
        this.baseDelayMs * Math.pow(2, this.retryCount - 1),
        this.maxDelayMs
      );

      useRealtimeStore.getState().setConnectionState('RECONNECTING');
      this.retryTimeoutId = setTimeout(() => {
        onReconnect();
      }, delay);
    } else {
      useRealtimeStore.getState().setConnectionState('OFFLINE');
    }
  }

  public reset(): void {
    this.retryCount = 0;
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
  }

  public getRetryCount(): number {
    return this.retryCount;
  }
}
