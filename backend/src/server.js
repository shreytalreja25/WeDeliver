import http from 'http';

import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { createApp } from './index.js';
import { initSockets } from './sockets/index.js';
import { startTerminalUI } from './monitor/terminal.js';

const start = async () => {
  const app = await createApp();
  const server = http.createServer(app);

  const io = initSockets(server);

  server.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });

  // Start fancy terminal UI
  startTerminalUI({ server, io });
};

start().catch((error) => {
  logger.error(error, 'Failed to start server');
  process.exit(1);
});
