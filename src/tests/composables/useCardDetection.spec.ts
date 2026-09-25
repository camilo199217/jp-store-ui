// Test del composable useCardDetection.
// Practica: testear composables de Vue usando ref() y nextTick().
import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useCardDetection } from '@/composables/useCardDetection.js'

describe('useCardDetection', () => {
  it('detecta VISA cuando el número empieza con 4', () => {
    // TODO: crea un ref con '4111111111111111'
    // y verifica que brand.value === 'visa'
  })

  it('detecta Mastercard cuando el número empieza con 51', () => {
    // TODO: prueba con '5111111111111111' → 'mastercard'
  })

  it('detecta Mastercard en el rango 2221-2720', () => {
    // TODO: prueba con '2221000000000000' → 'mastercard'
  })

  it('retorna unknown para números no reconocidos', () => {
    // TODO: prueba con '3714496353984' (Amex) → 'unknown'
  })

  it('formatea el número con espacios cada 4 dígitos', () => {
    // TODO: '4111111111111111' → '4111 1111 1111 1111'
  })

  it('ignora espacios y guiones al detectar la marca', () => {
    // TODO: '4111 1111 1111 1111' también debe dar 'visa'
  })

  it('la detección es reactiva — cambia cuando cambia el ref', async () => {
    // TODO: crea un ref con '4111...', verifica visa
    // luego cambia el ref a '5111...', verifica mastercard
  })
})
