import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { cartographer } from '@replit/vite-plugin-cartographer';
import errorModal from '@replit/vite-plugin-runtime-error-modal';
import shadcnPlugin from '@replit/vite-plugin-shadcn-theme-json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cartographer(),
    errorModal(),
    shadcnPlugin({
      themeJsonPath: resolve(__dirname, '../theme.json')
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@shared': resolve(__dirname, '../shared')
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
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
  }
});