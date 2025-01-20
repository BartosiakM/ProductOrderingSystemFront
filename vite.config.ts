import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/products': 'http://localhost:3000',
      '/categories': 'http://localhost:3000',
    },
  },
});
