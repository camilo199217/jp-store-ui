// Configuración de vue-i18n — todos los textos de la app pasan por aquí.
// Si en el futuro necesitamos inglés, solo agregamos otro locale.
import { createI18n } from 'vue-i18n'
import es from './locales/es.js'

export const i18n = createI18n({
  legacy: false,       // Usamos Composition API mode
  locale: 'es',
  fallbackLocale: 'es',
  messages: { es },
})
