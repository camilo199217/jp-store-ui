// Configuración de Vitest para el frontend.
// Uso jsdom como entorno para simular el DOM del navegador en los tests.
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    // jsdom simula el DOM del navegador — necesario para montar componentes Vue
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // Solo cuento como cobertura los archivos de la app, no los tests
      include: ['src/components/**', 'src/composables/**', 'src/store/**', 'src/views/**'],
      exclude: ['src/tests/**'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
