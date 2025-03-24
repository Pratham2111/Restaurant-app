import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@shared': resolve(__dirname, './shared')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 443, // Always use 443 for Replit
    },
    cors: true,
    // This is important to allow all hosts, particularly in the Replit environment
    allowedHosts: ["4cad050f-76f9-4af7-9027-5625a4c913e3-00-2nerdeeq86zec.janeway.replit.dev", "all"],
  },
  optimizeDeps: {
    include: ['@shared/schema.js'],
  },
  assetsInclude: ["**/*.html"],
  build: {
    outDir: 'client/dist',
    emptyOutDir: true,
    assetsDir: 'assets',
  }
});