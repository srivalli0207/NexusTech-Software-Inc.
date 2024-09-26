import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // direct /api to django dev server
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      // for serving static files for django admin site
      '/static': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  },
})
