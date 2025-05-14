import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use root path for deployment
const base = '/';

// https://vitejs.dev/config/
export default defineConfig({
  base, // Set base path for GitHub Pages
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure proper paths for GitHub Pages
    rollupOptions: {
      output: {
        // Ensure assets have a consistent name pattern
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Generate a manifest file for asset tracking
    manifest: true,
  },
});
