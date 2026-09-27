// Composable para detectar la marca de tarjeta en tiempo real mientras el usuario escribe.
// Usa credit-card-type (Braintree) para detección precisa de marca y formato.
import { computed } from 'vue'
import creditCardType from 'credit-card-type'
import type { CardBrand } from '@/types/index.js'

// Mapea los nicks de credit-card-type a nuestro CardBrand
const BRAND_MAP: Record<string, CardBrand> = {
  'visa':              'visa',
  'mastercard':        'mastercard',
  'american-express':  'amex',
  'diners-club':       'diners',
  'discover':          'discover',
  'unionpay':          'unionpay',
}

// Longitud máxima de dígitos según la marca
export const CARD_MAX_LENGTH: Record<CardBrand, number> = {
  visa:       16,
  mastercard: 16,
  amex:       15,
  diners:     14,
  discover:   16,
  unionpay:   19,
  unknown:    16,
}

// Formato de grupos según la marca (Amex: 4-6-5, Diners: 4-6-4, resto: 4-4-4-4)
export const CARD_FORMAT: Record<CardBrand, number[]> = {
  visa:       [4, 4, 4, 4],
  mastercard: [4, 4, 4, 4],
  amex:       [4, 6, 5],
  diners:     [4, 6, 4],
  discover:   [4, 4, 4, 4],
  unionpay:   [4, 4, 4, 4, 3],
  unknown:    [4, 4, 4, 4],
}

export function useCardDetection(cardNumber: () => string) {
  const brand = computed<CardBrand>(() => {
    const digits = cardNumber().replace(/\D/g, '')
    if (!digits) return 'unknown'

    const matches = creditCardType(digits)
    if (!matches.length) return 'unknown'

    return BRAND_MAP[matches[0].type] ?? 'unknown'
  })

  // Formato de grupos según la marca detectada
  const format = computed(() => CARD_FORMAT[brand.value])

  // Longitud máxima según la marca
  const maxLength = computed(() => CARD_MAX_LENGTH[brand.value])

  // Número formateado con los grupos correctos para cada marca
  const formattedNumber = computed(() => {
    const digits = cardNumber().replace(/\D/g, '').substring(0, maxLength.value)
    const groups = format.value
    let result = ''
    let pos = 0
    for (const groupSize of groups) {
      if (pos >= digits.length) break
      if (pos > 0) result += ' '
      result += digits.substring(pos, pos + groupSize)
      pos += groupSize
    }
    return result
  })

  return { brand, formattedNumber, maxLength, format }
}
