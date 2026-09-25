// Composable para detectar la marca de tarjeta en tiempo real mientras el usuario escribe.
// Usamos las mismas reglas de Luhn que usa el gateway de pago internamente.
import { computed } from 'vue'
import type { CardBrand } from '@/types/index.js'

/**
 * Detecta la marca de la tarjeta según el número ingresado.
 * Visa: empieza en 4
 * Mastercard: empieza en 51-55 o rango 2221-2720
 */
export function useCardDetection(cardNumber: () => string) {
  const brand = computed<CardBrand>(() => {
    // Limpio espacios y guiones para trabajar solo con dígitos
    const digits = cardNumber().replace(/\D/g, '')

    if (digits.startsWith('4')) return 'visa'

    const firstTwo = parseInt(digits.substring(0, 2), 10)
    const firstFour = parseInt(digits.substring(0, 4), 10)

    // Mastercard range 51-55
    if (firstTwo >= 51 && firstTwo <= 55) return 'mastercard'

    // Mastercard range 2221-2720
    if (firstFour >= 2221 && firstFour <= 2720) return 'mastercard'

    return 'unknown'
  })

  // Formatea el número con espacios cada 4 dígitos para mejor legibilidad
  const formattedNumber = computed(() => {
    const digits = cardNumber().replace(/\D/g, '').substring(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  })

  return { brand, formattedNumber }
}
