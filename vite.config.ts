// Configuración de Vite — el bundler que usa Vue 3.
// Proxy al backend en desarrollo para evitar problemas de CORS.
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // Alias @ para no escribir rutas relativas largas como ../../../components
    alias: { '@': resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    proxy: {
      // En desarrollo, las llamadas a /api van al backend NestJS
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
