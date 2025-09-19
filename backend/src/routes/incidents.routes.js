import { Router } from 'express';

import {
  createIncident,
  deleteIncident,
  listIncidents,
} from '../controllers/incidents.controller.js';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createIncidentSchema,
  deleteIncidentSchema,
  listIncidentSchema,
} from '../schemas/incident.schema.js';

const router = Router();

router.get('/', authRequired(['admin', 'driver']), validate(listIncidentSchema), listIncidents);
router.post('/', authRequired(['admin', 'driver']), validate(createIncidentSchema), createIncident);
router.delete('/:id', authRequired(['admin']), validate(deleteIncidentSchema), deleteIncident);

export default router;
