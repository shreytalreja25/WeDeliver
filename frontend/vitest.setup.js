import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = vi.fn(() => 'blob:mock');
}
