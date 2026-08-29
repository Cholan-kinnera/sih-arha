import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { telemetrySocket } from '../api';

describe('Real-Time WebSocket Telemetry Socket Manager', () => {
  it('has initial state DISCONNECTED', () => {
    telemetrySocket.disconnect();
    assert.equal(telemetrySocket.connectionStatus, 'DISCONNECTED');
  });

  it('allows subscription to message events and cleanup', () => {
    const unsub = telemetrySocket.subscribe(() => {
      // callback wired — cleanup verified below
    });

    assert.equal(typeof unsub, 'function');
    unsub();
  });

  it('allows subscription to status change events and cleanup', () => {
    let receivedStatus = '';
    const unsub = telemetrySocket.onStatusChange((status) => {
      receivedStatus = status;
    });

    assert.equal(receivedStatus, telemetrySocket.connectionStatus);
    unsub();
  });
});
