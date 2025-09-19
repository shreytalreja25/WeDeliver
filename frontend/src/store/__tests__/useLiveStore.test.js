import { vi } from 'vitest';

import { connectLiveSocket, disconnectLiveSocket } from '../../lib/socket.js';
import { useLiveStore } from '../useLiveStore.js';

vi.mock('../../lib/socket.js', () => ({
  connectLiveSocket: vi.fn(),
  disconnectLiveSocket: vi.fn(),
}));

describe('useLiveStore', () => {
  beforeEach(() => {
    useLiveStore.setState({
      drivers: [],
      incidents: [],
      zones: [],
      t: 0,
      connected: false,
      logs: [],
    });
  });

  it('connects via socket helper', () => {
    useLiveStore.getState().connectSocket();
    expect(connectLiveSocket).toHaveBeenCalled();
  });

  it('disconnect updates log', () => {
    useLiveStore.getState().disconnectSocket();
    expect(disconnectLiveSocket).toHaveBeenCalled();
    expect(useLiveStore.getState().logs.length).toBe(1);
  });
});
