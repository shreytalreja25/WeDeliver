import http from 'http';

import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { createApp } from './index.js';
import { initSockets } from './sockets/index.js';
<<<<<<< ours
import { startTerminalUI } from './monitor/terminal.js';
=======
>>>>>>> theirs

const start = async () => {
  const app = await createApp();
  const server = http.createServer(app);

<<<<<<< ours
  const io = initSockets(server);
=======
  initSockets(server);
>>>>>>> theirs

  server.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
<<<<<<< ours

  // Start fancy terminal UI
  startTerminalUI({ server, io });
=======
>>>>>>> theirs
};

start().catch((error) => {
  logger.error(error, 'Failed to start server');
  process.exit(1);
});
