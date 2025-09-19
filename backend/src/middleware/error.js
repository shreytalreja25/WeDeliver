import { logger } from '../config/logger.js';
import { recordError } from '../monitor/metrics.js';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  logger.error({ err }, 'Unhandled error');
  try {
    recordError(err);
  } catch {}
  return res.status(500).json({ message: 'Internal Server Error' });
};
