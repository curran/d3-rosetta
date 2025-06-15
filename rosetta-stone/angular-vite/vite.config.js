import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [], // Add Angular specific Vite plugins if needed
  resolve: {
    // alias: { // Example: if using path aliases in tsconfig
    //   '@app': '/src/app',
    // },
  },
  build: {
    rollupOptions: {
      // input: '/src/main.ts', // Ensure this points to your entry file
    },
  },
  // optimizeDeps: { // May be needed for some Angular dependencies
  //   include: ['@angular/core', '@angular/common', '@angular/platform-browser-dynamic'],
  // },
});
