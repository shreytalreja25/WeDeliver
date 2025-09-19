import bcrypt from 'bcrypt';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { connectDB, disconnectDB } from './connect.js';
import { User } from '../models/User.js';
import { Driver } from '../models/Driver.js';
import { Zone } from '../models/Zone.js';
import { Incident } from '../models/Incident.js';
import { Delivery } from '../models/Delivery.js';

const driversSeed = [
  {
    code: 'D-101',
    status: 'enroute',
    routeId: 'route-a',
    location: { lat: -33.8707, lng: 151.2073 },
    speedKph: 40,
  },
  {
    code: 'D-207',
    status: 'enroute',
    routeId: 'route-b',
    location: { lat: -33.8737, lng: 151.205 },
    speedKph: 38,
  },
  {
    code: 'D-334',
    status: 'enroute',
    routeId: 'route-b',
    location: { lat: -33.879, lng: 151.215 },
    speedKph: 35,
  },
];

const zonesSeed = [
  {
    center: { lat: -33.872, lng: 151.206 },
    radiusM: 600,
    level: 0.7,
    label: 'CBD congestion',
  },
  {
    center: { lat: -33.8785, lng: 151.21 },
    radiusM: 450,
    level: 0.5,
    label: 'Harbour bridge slow',
  },
];

const incidentsSeed = [
  {
    type: 'accident',
    location: { lat: -33.8703, lng: 151.2086 },
    severity: 4,
    ttlSec: 900,
  },
  {
    type: 'police',
    location: { lat: -33.876, lng: 151.213 },
    severity: 3,
    ttlSec: 600,
  },
  {
    type: 'ambulance',
    location: { lat: -33.874, lng: 151.201 },
    severity: 2,
    ttlSec: 720,
  },
];

const deliveriesSeed = async (drivers, admin) => {
  if (drivers.length === 0) return [];
  const delivery = await Delivery.create({
    customerId: admin._id,
    driverId: drivers[0]._id,
    origin: { lat: -33.871, lng: 151.205 },
    destination: { lat: -33.879, lng: 151.22 },
    eta: new Date(Date.now() + 45 * 60000),
    timeline: [
      { status: 'assigned', timestamp: new Date(), note: 'Auto-assigned from seed' },
      { status: 'picked', timestamp: new Date(), note: 'Collected parcel' },
    ],
    status: 'enroute',
  });
  return [delivery];
};

const run = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Driver.deleteMany({}),
    Zone.deleteMany({}),
    Incident.deleteMany({}),
    Delivery.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
  const admin = await User.create({
    email: env.ADMIN_EMAIL,
    passwordHash,
    role: 'admin',
  });

  const drivers = await Driver.insertMany(driversSeed);
  await Zone.insertMany(zonesSeed);
  await Incident.insertMany(incidentsSeed);
  await deliveriesSeed(drivers, admin);

  logger.info('Seed data inserted');

  await disconnectDB();
};

run().catch((error) => {
  logger.error(error, 'Failed to run seed');
  process.exit(1);
});
