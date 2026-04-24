import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  root: path.resolve(__dirname),
  base: '/thai-address-autofill/',
  server: {
    open: false,
  },
  build: {
    outDir: path.resolve(__dirname, '../dist-demo'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('compact-data-en')) return 'data-en';
          if (id.includes('compact-data-th')) return 'data-th';
          if (id.includes('node_modules/react')) return 'react-vendor';
        },
      },
    },
  },
});
