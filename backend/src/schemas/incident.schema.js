import { z } from 'zod';

const locationShape = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const listIncidentSchema = z.object({
  query: z.object({
    bbox: z
      .string()
      .optional()
      .refine((val) => !val || val.split(',').length === 4, 'bbox must have 4 comma separated values'),
  }),
});

export const createIncidentSchema = z.object({
  body: z.object({
    type: z.enum(['accident', 'police', 'ambulance']),
    location: locationShape,
    severity: z.number().min(1).max(5).default(3),
    ttlSec: z.number().min(30).max(3600).optional(),
  }),
});

export const deleteIncidentSchema = z.object({
  params: z.object({ id: z.string() }),
});
