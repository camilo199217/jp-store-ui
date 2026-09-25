// Test del molecule ToastNotification.
// Practica: testear timers con vi.useFakeTimers() y eventos de ciclo de vida.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ToastNotification from '@/components/molecules/ToastNotification.vue'

describe('ToastNotification', () => {
  beforeEach(() => {
    // Activo fake timers para controlar el setTimeout del auto-cierre
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('muestra el mensaje pasado como prop', () => {
    // TODO: monta con message="Error de prueba" y verifica que aparezca
  })

  it('aplica estilos de error cuando type="error"', () => {
    // TODO: verifica clase CSS de color rojo
  })

  it('aplica estilos de éxito cuando type="success"', () => {
    // TODO: verifica clase CSS de color verde
  })

  it('emite el evento close al hacer clic en el botón X', async () => {
    // TODO: trigger('click') en el botón de cierre y verifica emitted('close')
  })

  it('se auto-cierra después de 5000ms (duration por defecto)', async () => {
    // TODO: avanza el tiempo con vi.advanceTimersByTime(5000)
    // y verifica que el toast ya no sea visible (v-if=false)
  })

  it('respeta un duration personalizado', async () => {
    // TODO: monta con :duration="2000"
    // verifica que a los 1999ms aún es visible
    // y a los 2000ms ya no lo es
  })
})
