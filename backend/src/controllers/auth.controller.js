import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { User } from '../models/User.js';

const COOKIE_NAME = 'token';

const signToken = (user) =>
  jwt.sign({ sub: user._id.toString(), email: user.email, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

const setAuthCookie = (res, token) => {
  const secure = env.NODE_ENV === 'production' ? env.COOKIE_SECURE : false;
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

export const register = async (req, res) => {
  const { email, password, role } = req.validated.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, role });
  logger.info({ email, role }, 'User created');

  return res.status(201).json({ id: user._id, email: user.email, role: user.role });
};

export const login = async (req, res) => {
  const { email, password } = req.validated.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken(user);
  setAuthCookie(res, token);
  return res.json({ id: user._id, email: user.email, role: user.role });
};

export const logout = async (_req, res) => {
  const secure = env.NODE_ENV === 'production' ? env.COOKIE_SECURE : false;
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure });
  return res.json({ message: 'Logged out' });
};

export const me = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await User.findById(req.user.sub).lean();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ id: user._id, email: user.email, role: user.role });
};
