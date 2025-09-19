import { Router } from 'express';

import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { login, logout, me, register } from '../controllers/auth.controller.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/register', authRequired(['admin']), validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authRequired(), logout);
router.get('/me', authRequired(), me);

export default router;
