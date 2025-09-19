import { createDriverSchema } from '../src/schemas/driver.schema.js';

describe('zod schemas', () => {
  it('validates driver payload', () => {
    const result = createDriverSchema.safeParse({
      body: {
        code: 'D-100',
        location: { lat: 1, lng: 2 },
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid driver payload', () => {
    const result = createDriverSchema.safeParse({ body: { code: 'X' } });
    expect(result.success).toBe(false);
  });
});
