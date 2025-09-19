import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';

import { corsMiddleware } from './config/cors.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDB } from './db/connect.js';
<<<<<<< ours
import { metricsMiddleware } from './monitor/metrics.js';
=======
>>>>>>> theirs
import authRoutes from './routes/auth.routes.js';
import deliveriesRoutes from './routes/deliveries.routes.js';
import driversRoutes from './routes/drivers.routes.js';
import incidentsRoutes from './routes/incidents.routes.js';
import zonesRoutes from './routes/zones.routes.js';
import { errorHandler } from './middleware/error.js';
import { optionalAuth } from './middleware/auth.js';

export const createApp = async () => {
  await connectDB();

  const app = express();

  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(corsMiddleware);
  app.use(express.json());
  app.use(cookieParser());
<<<<<<< ours
  app.use(metricsMiddleware);
=======
>>>>>>> theirs
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/', (_req, res) => {
    res.json({ service: 'Deliwer API', uptime: process.uptime() });
  });

  app.use(optionalAuth);

  app.use('/api/auth', authRoutes);
  app.use('/api/drivers', driversRoutes);
  app.use('/api/deliveries', deliveriesRoutes);
  app.use('/api/incidents', incidentsRoutes);
  app.use('/api/zones', zonesRoutes);

  app.use(errorHandler);

  return app;
};
