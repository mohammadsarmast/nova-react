import { defineConfig } from 'tsup';
import { copyFileSync } from 'fs';

const shared = {
  format: ['esm', 'cjs'],
  dts: false,
  splitting: false,
  sourcemap: true,
  external: ['react', 'react-dom'],
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
]);
