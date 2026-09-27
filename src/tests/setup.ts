// Archivo de setup global para Vitest.
// Se ejecuta antes de cada archivo de test.
import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import messages from '@/i18n/locales/es.js'

// Configuro vue-i18n globalmente para que todos los componentes puedan usar t()
const i18n = createI18n({
  legacy: false,
  locale: 'es',
  messages: { es: messages },
})

config.global.plugins = [i18n]

// Silencio los warnings de Vue que no son relevantes para los tests
config.global.config.warnHandler = () => {}
