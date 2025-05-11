import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get repository name from environment or use default
const repositoryName = 'Southwest-Vacations';
const base = process.env.NODE_ENV === 'production' ? `/${repositoryName}/` : '/';

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
});
