import { Server } from 'socket.io';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { Driver } from '../models/Driver.js';
import { Incident } from '../models/Incident.js';
import { Zone } from '../models/Zone.js';
import { createIncident } from '../controllers/incidents.controller.js';
import { metrics } from '../monitor/metrics.js';

const TICK_MS = 2000;

const sanitizeDrivers = (drivers) =>
  drivers.map((driver) => ({
    id: driver._id,
    code: driver.code,
    status: driver.status,
    location: driver.location,
    speedKph: driver.speedKph,
  }));

const sanitizeIncidents = (incidents) =>
  incidents.map((incident) => ({
    id: incident._id,
    type: incident.type,
    location: incident.location,
    severity: incident.severity,
    ttlSec: incident.ttlSec,
    createdAt: incident.createdAt,
  }));

export const initSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: env.corsOrigins,
      credentials: true,
    },
  });

  const live = io.of('/live');

  const demoTick = async () => {
    if (env.SEED_MODE !== 'demo') return;

    const drivers = await Driver.find();
    await Promise.all(
      drivers.map(async (driver) => {
        const jitterLat = (Math.random() - 0.5) * 0.001;
        const jitterLng = (Math.random() - 0.5) * 0.001;
        driver.location.lat += jitterLat;
        driver.location.lng += jitterLng;
        driver.speedKph = Math.max(20, Math.min(60, driver.speedKph + (Math.random() - 0.5) * 5));
        driver.updatedAt = new Date();
        await driver.save();
      }),
    );

    const now = Date.now();
    const incidents = await Incident.find();
    await Promise.all(
      incidents.map(async (incident) => {
        const ttlMs = incident.ttlSec * 1000;
        if (incident.createdAt.getTime() + ttlMs < now) {
          await Incident.findByIdAndDelete(incident._id);
        }
      }),
    );
  };

  const broadcastState = async () => {
    const [drivers, incidents, zones] = await Promise.all([
      Driver.find().lean(),
      Incident.find().lean(),
      Zone.find().lean(),
    ]);

    live.emit('drivers:update', sanitizeDrivers(drivers));
    live.emit('incidents:update', sanitizeIncidents(incidents));
    live.emit('zones:update', zones);
  };

  live.on('connection', (socket) => {
    logger.info({ id: socket.id }, 'Socket connected to /live');
    metrics.socketsConnected += 1;
    const driverId = socket.handshake.auth?.driverId;

    socket.on('disconnect', () => {
      logger.info({ id: socket.id }, 'Socket disconnected from /live');
      metrics.socketsConnected = Math.max(0, metrics.socketsConnected - 1);
    });

    socket.on('driver:location', async (payload) => {
      if (!driverId) return;
      await Driver.findByIdAndUpdate(driverId, {
        location: payload,
        speedKph: payload.speedKph ?? 0,
        updatedAt: new Date(),
      });
      broadcastState();
    });

    socket.on('driver:status', async ({ status }) => {
      if (!driverId) return;
      await Driver.findByIdAndUpdate(driverId, { status, updatedAt: new Date() });
      broadcastState();
    });

    socket.on('incident:report', async (incidentPayload) => {
      await createIncident(
        {
          validated: { body: incidentPayload },
        },
        {
          status: () => ({ json: () => {} }),
          json: () => {},
        },
      );
      broadcastState();
    });
  });

  setInterval(async () => {
    await demoTick();
    await broadcastState();
  }, TICK_MS);

  return io;
};
