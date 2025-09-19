import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { User } from '../models/User.js';

export const authRequired = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies?.token;
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const payload = jwt.verify(token, env.JWT_SECRET);
      req.user = payload;

      if (roles.length > 0 && !roles.includes(payload.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      if (!req.userDoc) {
        const userDoc = await User.findById(payload.sub).lean();
        req.userDoc = userDoc;
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
};

export const optionalAuth = async (req, _res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return next();
    }
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return next();
  }
};
