import { z } from 'zod';

const centerShape = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const createZoneSchema = z.object({
  body: z.object({
    center: centerShape,
    radiusM: z.number().positive(),
    level: z.number().min(0).max(1),
    label: z.string(),
  }),
});

export const updateZoneSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z
    .object({
      center: centerShape.optional(),
      radiusM: z.number().positive().optional(),
      level: z.number().min(0).max(1).optional(),
      label: z.string().optional(),
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field required',
    }),
});

export const deleteZoneSchema = z.object({
  params: z.object({ id: z.string() }),
});
