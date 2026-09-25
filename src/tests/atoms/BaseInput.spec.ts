// Test del átomo BaseInput.
// Practica: interacción con inputs, slots nombrados y estados de validación.
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '@/components/atoms/BaseInput.vue'

describe('BaseInput', () => {
  it('renderiza el label correctamente', () => {
    // TODO: monta con label="Nombre" y verifica que aparezca en el template
  })

  it('emite el valor al escribir (v-model)', async () => {
    // TODO: monta con v-model, llama setValue('hola') en el input
    // y verifica que el evento 'update:modelValue' fue emitido con 'hola'
  })

  it('muestra el mensaje de error cuando se pasa la prop error', () => {
    // TODO: monta con :error="'Campo requerido'"
    // y verifica que ese texto esté visible en el DOM
  })

  it('aplica clase de error en el input cuando hay error', () => {
    // TODO: verifica que el input tenga la clase de estado error
    // (borde rojo, ring rojo, etc.)
  })

  it('aplica clase de éxito cuando no hay error y hay valor', () => {
    // TODO: monta sin error y con modelValue="algo"
    // y verifica la clase de estado válido
  })

  it('renderiza el slot prefix', () => {
    // TODO: usa el slot #prefix con un ícono y verifica que se renderice
  })

  it('renderiza el slot suffix', () => {
    // TODO: similar con el slot #suffix
  })
})
