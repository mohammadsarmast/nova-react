import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const root = resolve(import.meta.dirname);
const demoRoot = resolve(root, 'demo');

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/nova-react/' : '/',
  plugins: [react({ jsxRuntime: 'automatic' })],
  root: demoRoot,
  esbuild: {
    jsx: 'automatic',
  },
  server: {
    fs: {
      allow: [root],
    },
  },
  resolve: {
    alias: {
      'nova-react/autocomplete': resolve(root, 'src/autocomplete/index.js'),
      'nova-react/button': resolve(root, 'src/button/index.js'),
      'nova-react/chart': resolve(root, 'src/chart/index.js'),
      'nova-react/datatable': resolve(root, 'src/datatable/index.js'),
    },
  },
  build: {
    outDir: resolve(demoRoot, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(demoRoot, 'index.html'),
        autocomplete: resolve(demoRoot, 'autocomplete.html'),
        button: resolve(demoRoot, 'button.html'),
        chart: resolve(demoRoot, 'chart.html'),
        datatable: resolve(demoRoot, 'datatable.html'),
      },
    },
  },
}));
