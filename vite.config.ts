import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get repository name for GitHub Pages deployment
const repositoryName = 'Southwest-Vacations';
const isProduction = process.env.NODE_ENV === 'production';
// Use repository-based path in production, root path in development
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
        // Make sure we're not using ESM modules which can cause MIME type issues
        format: 'iife',
        // Add code splitting optimization for better loading
        manualChunks: id => {
          // Group chart libraries together
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
            return 'chart-vendor';
          }
          // Group MUI components together
          if (id.includes('@mui')) {
            return 'mui-vendor';
          }
          // Group React and related packages
          if (id.includes('react') || id.includes('redux')) {
            return 'react-vendor';
          }
          // Group location/geo data
          if (id.includes('country') || id.includes('location') || id.includes('geo')) {
            return 'location-data';
          }
        },
      },
    },
    // Generate a manifest file for asset tracking
    manifest: true,
    // Important: Set to true for compatibility with older browsers
    target: 'es2015',
    // Enable minification for production builds
    minify: 'terser',
    // Terser options for better compression
    terserOptions: {
      compress: {
        drop_console: isProduction,
        drop_debugger: isProduction,
      },
    },
  },
  // Optimize dependencies to speed up loading
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      'chart.js',
      'react-chartjs-2',
    ],
    // Exclude heavy, rarely used packages from initial bundle
    exclude: ['country-state-city', 'i18n-iso-countries'],
  },
  // Define environment variables
  define: {
    'import.meta.env.VITE_MOCK_AUTH': JSON.stringify(isProduction ? 'true' : 'false'),
    'import.meta.env.VITE_IS_GITHUB_PAGES': JSON.stringify(isProduction ? 'true' : 'false'),
  },
});
