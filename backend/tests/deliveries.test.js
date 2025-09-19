import bcrypt from 'bcrypt';
import request from 'supertest';

import { createApp } from '../src/index.js';
import { Driver } from '../src/models/Driver.js';
import { User } from '../src/models/User.js';

let app;
let adminAgent;
let driver;
let customer;

const adminCreds = { email: 'admin@example.com', password: 'AdminPass9!' };

describe('deliveries API', () => {
  beforeAll(async () => {
    app = await createApp();
    await User.deleteMany({});
    await Driver.deleteMany({});

    const passwordHash = await bcrypt.hash(adminCreds.password, 10);
    const admin = await User.create({ email: adminCreds.email, passwordHash, role: 'admin' });
    customer = await User.create({
      email: 'customer@example.com',
      passwordHash: await bcrypt.hash('Customer123!', 10),
      role: 'customer',
    });

    driver = await Driver.create({
      code: 'D-999',
      status: 'assigned',
      location: { lat: 0, lng: 0 },
      speedKph: 0,
    });

    adminAgent = request.agent(app);
    await adminAgent.post('/api/auth/login').send(adminCreds);
  });

  it('creates delivery and updates status', async () => {
    const createRes = await adminAgent.post('/api/deliveries').send({
      customerId: customer._id.toString(),
      driverId: driver._id.toString(),
      origin: { lat: 1, lng: 2 },
      destination: { lat: 3, lng: 4 },
    });

    expect(createRes.status).toBe(201);
    expect(createRes.body.status).toBe('assigned');

    const deliveryId = createRes.body._id;
    const updateRes = await adminAgent.patch(`/api/deliveries/${deliveryId}/status`).send({
      status: 'enroute',
      note: 'Package picked up',
    });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe('enroute');
    expect(updateRes.body.timeline.at(-1).note).toBe('Package picked up');
  });
});
