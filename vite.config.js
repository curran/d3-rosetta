import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'd3Rosetta',
      fileName: (format) =>
        `d3-rosetta.${format === 'es' ? 'esm' : 'umd'}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['d3-selection'],
      output: {
        globals: {
          'd3-selection': 'd3',
        },
      },
    },
  },
});
