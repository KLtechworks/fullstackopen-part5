import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
console.log('Proxy configured for /api')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',  
    globals: true,         
    setupFiles: './testSetup.js',  
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true

      }
    }
  }
})
