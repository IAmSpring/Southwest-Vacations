import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get repository name from environment or use default
const repositoryName = process.env.REPOSITORY_NAME || 'Southwest-Vacations';
const isProduction = process.env.NODE_ENV === 'production';
// Use a root base path in development mode, only use the repository-based path in production
const base = isProduction ? `/${repositoryName}/` : '/';

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
