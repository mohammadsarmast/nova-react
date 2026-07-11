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
      'nova-react/workspace': resolve(root, 'src/workspace/index.js'),
      'nova-react/calendar': resolve(root, 'src/calendar/index.js'),
      'nova-react/calendar/styles.css': resolve(root, 'src/calendar/styles/calendar.css'),
      'nova-react/cascadeselect': resolve(root, 'src/cascadeselect/index.js'),
      'nova-react/cascadeselect/styles.css': resolve(root, 'src/cascadeselect/styles/cascadeselect.css'),
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
        workspace: resolve(demoRoot, 'workspace.html'),
        calendar: resolve(demoRoot, 'calendar.html'),
        cascadeselect: resolve(demoRoot, 'cascadeselect.html'),
      },
    },
  },
}));
