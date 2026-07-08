import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/autocomplete/index.js'],
  outDir: 'dist/autocomplete',
  format: ['esm', 'cjs'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  injectStyle: false,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
    options.loader = {
      ...options.loader,
      '.jsx': 'jsx',
    };
  },
  onSuccess: async () => {
    const { copyFileSync } = await import('fs');
    copyFileSync(
      'src/autocomplete/styles/autocomplete.css',
      'dist/autocomplete/index.css'
    );
  },
});
