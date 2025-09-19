import { disconnectDB } from '../src/db/connect.js';

afterAll(async () => {
  await disconnectDB();
});
