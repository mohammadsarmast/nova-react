import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const root = resolve(import.meta.dirname);

export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    globals: true,
  },
  resolve: {
    alias: {
      'nova-react/button': resolve(root, 'src/button/index.js'),
      'nova-react/chart': resolve(root, 'src/chart/index.js'),
    },
  },
});
