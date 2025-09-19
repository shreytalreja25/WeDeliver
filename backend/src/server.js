import http from 'http';

import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { createApp } from './index.js';
import { initSockets } from './sockets/index.js';

const start = async () => {
  const app = await createApp();
  const server = http.createServer(app);

  initSockets(server);

  server.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
};

start().catch((error) => {
  logger.error(error, 'Failed to start server');
  process.exit(1);
});
