import { logger } from '../config/logger.js';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  logger.error({ err }, 'Unhandled error');
  return res.status(500).json({ message: 'Internal Server Error' });
};
