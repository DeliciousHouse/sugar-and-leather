import { vi } from 'vitest';

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((query) => ({
      addEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
    })),
  });

  window.scrollTo = vi.fn();

  globalThis.IntersectionObserver = class IntersectionObserver {
    disconnect() {}

    observe() {}

    takeRecords() {
      return [];
    }

    unobserve() {}
  };
}
