import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  base: '/',
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.vitest.test.{js,jsx,mjs}'],
    setupFiles: './tests/setup.js',
    testTimeout: 30_000,
  },
});
