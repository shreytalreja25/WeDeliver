import request from 'supertest';

import { createApp } from '../src/index.js';

let app;

describe('health check', () => {
  beforeAll(async () => {
    app = await createApp();
  });

  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
