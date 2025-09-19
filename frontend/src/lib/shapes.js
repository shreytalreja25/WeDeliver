import { z } from 'zod';

export const locationShape = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const incidentShape = z.object({
  type: z.enum(['accident', 'police', 'ambulance']),
  location: locationShape,
  severity: z.number().min(1).max(5),
  ttlSec: z.number().min(30).max(3600).optional(),
});

export const loginShape = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
