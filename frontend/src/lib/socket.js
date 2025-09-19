import { io } from 'socket.io-client';

let socket;

const resolveSocketURL = () => {
  const envUrl = import.meta.env.VITE_SOCKET_URL;
  if (envUrl && envUrl.trim().length > 0) return envUrl;
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:8080`;
  }
  return 'http://localhost:8080';
};

export const connectLiveSocket = ({ onConnect, onDisconnect, onDrivers, onIncidents, onZones }) => {
  if (!socket) {
    socket = io(`${resolveSocketURL()}/live`, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
    });
  }

  socket.removeAllListeners();

  if (onConnect) socket.on('connect', onConnect);
  if (onDisconnect) socket.on('disconnect', onDisconnect);
  if (onDrivers) socket.on('drivers:update', onDrivers);
  if (onIncidents) socket.on('incidents:update', onIncidents);
  if (onZones) socket.on('zones:update', onZones);

  socket.connect();
};

export const disconnectLiveSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const emitDriverLocation = (payload) => {
  if (socket) {
    socket.emit('driver:location', payload);
  }
};

export const emitDriverStatus = (payload) => {
  if (socket) {
    socket.emit('driver:status', payload);
  }
};

export const emitIncidentReport = (payload) => {
  if (socket) {
    socket.emit('incident:report', payload);
  }
};
