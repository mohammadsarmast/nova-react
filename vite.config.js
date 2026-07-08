import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: resolve(import.meta.dirname, 'demo'),
  resolve: {
    alias: {
      'nova-react/autocomplete': resolve(import.meta.dirname, 'src/autocomplete/index.js'),
    },
  },
});
