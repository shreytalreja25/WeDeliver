import bcrypt from 'bcrypt';
import request from 'supertest';

import { createApp } from '../src/index.js';
import { User } from '../src/models/User.js';

let app;

const password = 'Secret123!';
const email = 'tester@example.com';

describe('auth flows', () => {
  beforeAll(async () => {
    app = await createApp();
    await User.deleteMany({ email });
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, passwordHash, role: 'admin' });
  });

  it('logs in, reads me, logs out', async () => {
    const agent = request.agent(app);

    const loginRes = await agent.post('/api/auth/login').send({ email, password });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.email).toBe(email);

    const meRes = await agent.get('/api/auth/me');
    expect(meRes.status).toBe(200);
    expect(meRes.body.role).toBe('admin');

    const logoutRes = await agent.post('/api/auth/logout');
    expect(logoutRes.status).toBe(200);
  });
});
