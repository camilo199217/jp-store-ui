// Test del composable usePriceFormat.
// Practica: testear funciones puras — son los tests más simples de escribir.
import { describe, it, expect } from 'vitest'
import { usePriceFormat } from '@/composables/usePriceFormat.js'

describe('usePriceFormat', () => {
  const { formatPrice } = usePriceFormat()

  it('formatea 299900 centavos como $2.999 COP', () => {
    // TODO: expect(formatPrice(299900)).toContain('2.999')
  })

  it('formatea 0 centavos como $0 COP', () => {
    // TODO: verifica que 0 centavos dé $0
  })

  it('incluye el símbolo $ en la salida', () => {
    // TODO: verifica que el string incluya el símbolo $
  })

  it('formatea números grandes correctamente', () => {
    // TODO: 10000000 centavos → $100.000
  })
})
