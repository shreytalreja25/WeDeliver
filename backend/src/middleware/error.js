import { logger } from '../config/logger.js';
<<<<<<< ours
import { recordError } from '../monitor/metrics.js';
=======
>>>>>>> theirs

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  logger.error({ err }, 'Unhandled error');
<<<<<<< ours
  try {
    recordError(err);
  } catch {}
=======
>>>>>>> theirs
  return res.status(500).json({ message: 'Internal Server Error' });
};
