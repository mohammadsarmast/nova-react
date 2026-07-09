import { defineConfig } from 'tsup';
import { copyFileSync } from 'fs';

const shared = {
  format: ['esm', 'cjs'],
  dts: false,
  splitting: false,
  sourcemap: true,
  external: ['react', 'react-dom', 'chart.js'],
  injectStyle: false,
  esbuildOptions(options) {
    options.banner = { js: '"use client";' };
    options.loader = { ...options.loader, '.jsx': 'jsx' };
    options.jsx = 'automatic';
  },
};

export default defineConfig([
  {
    ...shared,
    entry: ['src/autocomplete/index.js'],
    outDir: 'dist/autocomplete',
    clean: true,
    onSuccess() {
      copyFileSync('src/autocomplete/styles/autocomplete.css', 'dist/autocomplete/index.css');
    },
  },
  {
    ...shared,
    entry: ['src/button/index.js'],
    outDir: 'dist/button',
    onSuccess() {
      copyFileSync('src/button/styles/button.css', 'dist/button/index.css');
    },
  },
  {
    ...shared,
    entry: ['src/chart/index.js'],
    outDir: 'dist/chart',
    onSuccess() {
      copyFileSync('src/chart/styles/chart.css', 'dist/chart/index.css');
    },
  },
  {
    ...shared,
    entry: ['src/datatable/index.js'],
    outDir: 'dist/datatable',
    onSuccess() {
      copyFileSync('src/datatable/styles/datatable.css', 'dist/datatable/index.css');
    },
  },
]);
