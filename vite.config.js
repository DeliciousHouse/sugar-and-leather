import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  base: '/',
  test: {
    environment: 'jsdom',
    exclude: ['test/**', 'node_modules/**'],
    setupFiles: './tests/setup.js',
    testTimeout: 15_000,
  },
});
