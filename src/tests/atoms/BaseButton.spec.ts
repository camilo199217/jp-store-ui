// Test del átomo BaseButton.
// Practica: montar componentes Vue con @vue/test-utils y verificar slots, props y eventos.
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/atoms/BaseButton.vue'

describe('BaseButton', () => {
  it('renderiza el slot por defecto', () => {
    // TODO: monta BaseButton con un texto en el slot
    // y verifica que ese texto esté en el HTML del componente
  })

  it('aplica la clase correcta para variant="primary"', () => {
    // TODO: monta BaseButton con variant="primary"
    // y verifica que el elemento tenga la clase btn-primary
  })

  it('aplica la clase correcta para variant="ghost"', () => {
    // TODO: similar al anterior pero con variant="ghost"
  })

  it('emite el evento click al hacer clic', async () => {
    // TODO: monta el botón, llama trigger('click')
    // y verifica que wrapper.emitted('click') tenga un entry
  })

  it('no emite click cuando está disabled', async () => {
    // TODO: monta con :disabled="true", llama trigger('click')
    // y verifica que NO se haya emitido el evento
  })

  it('muestra el spinner cuando loading=true', () => {
    // TODO: monta con :loading="true"
    // y verifica que el spinner esté presente en el DOM
  })

  it('aplica el tamaño correcto con prop size="sm"', () => {
    // TODO: verifica que el botón tenga las clases de tamaño pequeño
  })
})
