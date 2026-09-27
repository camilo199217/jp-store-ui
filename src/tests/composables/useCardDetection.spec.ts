import { describe, it, expect } from 'vitest'
import { ref, nextTick } from 'vue'
import { useCardDetection } from '@/composables/useCardDetection.js'

describe('useCardDetection', () => {
  it('detecta VISA cuando el número empieza con 4', () => {
    const { brand } = useCardDetection(() => '4111111111111111')

    expect(brand.value).toBe('visa')
  })

  it('detecta Mastercard cuando el número empieza con 51', () => {
    const { brand } = useCardDetection(() => '5111111111111111')

    expect(brand.value).toBe('mastercard')
  })

  it('detecta Mastercard en el rango 2221-2720', () => {
    const { brand } = useCardDetection(() => '2221000000000000')

    expect(brand.value).toBe('mastercard')
  })

  it('retorna unknown para números no reconocidos', () => {
    const { brand } = useCardDetection(() => '9999999999999999')

    expect(brand.value).toBe('unknown')
  })

  it('formatea el número con espacios cada 4 dígitos', () => {
    const { formattedNumber } = useCardDetection(() => '4111111111111111')

    expect(formattedNumber.value).toBe('4111 1111 1111 1111')
  })

  it('ignora espacios y guiones al detectar la marca', () => {
    const { brand } = useCardDetection(() => '4111 1111 1111 1111')

    expect(brand.value).toBe('visa')
  })

  it('la detección es reactiva — cambia cuando cambia el ref', async () => {
    const cardNumber = ref('4111111111111111')
    const { brand } = useCardDetection(() => cardNumber.value)

    expect(brand.value).toBe('visa')

    cardNumber.value = '5111111111111111'
    await nextTick()

    expect(brand.value).toBe('mastercard')
  })
})
