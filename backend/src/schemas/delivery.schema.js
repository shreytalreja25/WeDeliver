import { z } from 'zod';

const pointShape = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const createDeliverySchema = z.object({
  body: z.object({
    customerId: z.string(),
    driverId: z.string(),
    eta: z.string().datetime().optional(),
    origin: pointShape,
    destination: pointShape,
  }),
});

export const getDeliverySchema = z.object({
  params: z.object({ id: z.string() }),
});

export const updateDeliveryStatusSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    status: z.enum(['assigned', 'picked', 'enroute', 'delivered', 'failed']),
    note: z.string().optional(),
  }),
});
