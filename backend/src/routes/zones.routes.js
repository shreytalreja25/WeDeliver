import { Router } from 'express';

import { createZone, deleteZone, listZones, updateZone } from '../controllers/zones.controller.js';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createZoneSchema,
  deleteZoneSchema,
  updateZoneSchema,
} from '../schemas/zone.schema.js';

const router = Router();

router.get('/', authRequired(['admin']), listZones);
router.post('/', authRequired(['admin']), validate(createZoneSchema), createZone);
router.patch('/:id', authRequired(['admin']), validate(updateZoneSchema), updateZone);
router.delete('/:id', authRequired(['admin']), validate(deleteZoneSchema), deleteZone);

export default router;
