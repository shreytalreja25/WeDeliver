import { Router } from 'express';

import {
  createDelivery,
  getDelivery,
  listDeliveries,
  updateDeliveryStatus,
} from '../controllers/deliveries.controller.js';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createDeliverySchema,
  getDeliverySchema,
  updateDeliveryStatusSchema,
} from '../schemas/delivery.schema.js';

const router = Router();

router.get('/', authRequired(['admin']), listDeliveries);
router.post('/', authRequired(['admin']), validate(createDeliverySchema), createDelivery);
router.get('/:id', authRequired(['admin']), validate(getDeliverySchema), getDelivery);
router.patch(
  '/:id/status',
  authRequired(['admin']),
  validate(updateDeliveryStatusSchema),
  updateDeliveryStatus,
);

export default router;
