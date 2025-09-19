import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(8080),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CORS_ALLOWLIST: z.string().default(''),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECURE: z.coerce.boolean().default(false),
  MONGODB_URI: z.string(),
  MONGODB_URI_TEST: z.string().optional(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),
  SEED_MODE: z.enum(['demo', 'live']).default('demo'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration');
  console.error(parsed.error.format());
  process.exit(1);
}

const rawAllowlist = parsed.data.CORS_ALLOWLIST;
const corsOrigins = rawAllowlist
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  ...parsed.data,
  corsOrigins,
};
