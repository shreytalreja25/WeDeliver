import { create } from 'zustand';

import { connectLiveSocket, disconnectLiveSocket } from '../lib/socket.js';

const initialState = {
  drivers: [],
  incidents: [],
  zones: [],
  t: 0,
  connected: false,
  logs: [],
};


const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const addLog = (logs, entry) => [
  { id: generateUniqueId(), message: entry, timestamp: new Date().toISOString() },
  ...logs,
];

export const useLiveStore = create((set, get) => ({
  ...initialState,
  connectSocket: () => {
    if (get().connected) return;
    connectLiveSocket({
      onConnect: () => {
        set((state) => ({ connected: true, logs: addLog(state.logs, 'Socket connected') }));
      },
      onDisconnect: () => {
        set((state) => ({ connected: false, logs: addLog(state.logs, 'Socket disconnected') }));
      },
      onDrivers: (drivers) => {
        set((state) => ({ drivers, t: state.t + 1 }));
      },
      onIncidents: (incidents) => set({ incidents }),
      onZones: (zones) => set({ zones }),
    });
  },
  disconnectSocket: () => {
    disconnectLiveSocket();
    set((state) => ({ connected: false, logs: addLog(state.logs, 'Socket disconnected by user') }));
  },
  seedLocal: ({ drivers = [], incidents = [], zones = [] }) => {
    set((state) => ({
      drivers,
      incidents,
      zones,
      logs: addLog(state.logs, 'Local state seeded'),
    }));
  },
  addIncident: (incident) => {
    set((state) => ({
      incidents: [incident, ...state.incidents],
      logs: addLog(state.logs, `Incident added (${incident.type})`),
    }));
  },
  clearIncidents: () => {
    set((state) => ({ incidents: [], logs: addLog(state.logs, 'Incidents cleared') }));
  },
  reset: () => set(initialState),
}));
