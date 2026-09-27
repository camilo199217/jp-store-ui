import { describe, it, expect } from 'vitest'
import { usePriceFormat } from '@/composables/usePriceFormat.js'

describe('usePriceFormat', () => {
  const { formatPrice } = usePriceFormat()

  it('formatea 299900 centavos como $2.999 COP', () => {
    expect(formatPrice(299900)).toContain('2.999')
  })

  it('formatea 0 centavos como $0 COP', () => {
    expect(formatPrice(0)).toContain('0')
  })

  it('incluye el símbolo $ en la salida', () => {
    expect(formatPrice(100)).toContain('$')
  })

  it('formatea números grandes correctamente', () => {
    expect(formatPrice(10000000)).toContain('100.000')
  })
})
