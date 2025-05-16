import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: '/', // Default base path
  };

  // Adjust base path for GitHub Pages deployment
  if (command === 'build' && process.env.VITE_BASE_URL) {
    config.base = process.env.VITE_BASE_URL;
  }

  return config;
});
