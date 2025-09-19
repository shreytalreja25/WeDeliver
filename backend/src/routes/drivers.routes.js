import { Router } from 'express';

import { createDriver, getDriver, listDrivers, updateDriver } from '../controllers/drivers.controller.js';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createDriverSchema,
  getDriverSchema,
  updateDriverSchema,
} from '../schemas/driver.schema.js';

const router = Router();

router.get('/', authRequired(['admin']), listDrivers);
router.post('/', authRequired(['admin']), validate(createDriverSchema), createDriver);
router.get('/:id', authRequired(['admin']), validate(getDriverSchema), getDriver);
router.patch('/:id', authRequired(['admin']), validate(updateDriverSchema), updateDriver);

export default router;
