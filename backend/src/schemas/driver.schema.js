import { z } from 'zod';

const locationShape = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const createDriverSchema = z.object({
  body: z.object({
    code: z.string(),
    status: z.string().optional(),
    location: locationShape,
    routeId: z.string().optional(),
    speedKph: z.number().optional(),
  }),
});

export const updateDriverSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z
    .object({
      status: z.string().optional(),
      speedKph: z.number().optional(),
      location: locationShape.optional(),
      routeId: z.string().optional(),
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field required',
    }),
});

export const getDriverSchema = z.object({
  params: z.object({ id: z.string() }),
});
