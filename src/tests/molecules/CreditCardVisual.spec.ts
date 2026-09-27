import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CreditCardVisual from '@/components/molecules/CreditCardVisual.vue'
import type { CardBrand } from '@/types/index.js'

const defaultProps = {
  cardNumber: '',
  cardName: 'JUAN PALACIO',
  cardExpiry: '12/28',
  cardCvv: '123',
  brand: 'unknown' as CardBrand,
  showBack: false,
}

describe('CreditCardVisual', () => {
  it('renderiza el frente de la tarjeta con nombre y vencimiento', () => {
    const wrapper = mount(CreditCardVisual, { props: defaultProps })
    expect(wrapper.html()).toContain('JUAN PALACIO')
    expect(wrapper.html()).toContain('12/28')
  })

  it('aplica el gradiente de Visa cuando brand=visa', () => {
    const wrapper = mount(CreditCardVisual, {
      props: { ...defaultProps, brand: 'visa' as CardBrand },
    })
    expect(wrapper.html()).toContain('1a1f71')
  })

  it('aplica el gradiente de Mastercard cuando brand=mastercard', () => {
    const wrapper = mount(CreditCardVisual, {
      props: { ...defaultProps, brand: 'mastercard' as CardBrand },
    })
    expect(wrapper.html()).toContain('eb5757')
  })

  it('aplica el gradiente de Amex cuando brand=amex', () => {
    const wrapper = mount(CreditCardVisual, {
      props: { ...defaultProps, brand: 'amex' as CardBrand },
    })
    expect(wrapper.html()).toContain('0070BA')
  })

  it('muestra el número formateado con relleno de puntos cuando está vacío', () => {
    const wrapper = mount(CreditCardVisual, { props: defaultProps })
    expect(wrapper.html()).toContain('•')
  })

  it('formatea el número de Visa en grupos de 4', () => {
    const wrapper = mount(CreditCardVisual, {
      props: { ...defaultProps, cardNumber: '4111111111111111', brand: 'visa' as CardBrand },
    })
    expect(wrapper.html()).toContain('4111 1111 1111 1111')
  })

  it('aplica la clase is-flipped cuando showBack=true', () => {
    const wrapper = mount(CreditCardVisual, {
      props: { ...defaultProps, showBack: true },
    })
    expect(wrapper.find('.is-flipped').exists()).toBe(true)
  })

  it('NO aplica la clase is-flipped cuando showBack=false', () => {
    const wrapper = mount(CreditCardVisual, { props: defaultProps })
    expect(wrapper.find('.is-flipped').exists()).toBe(false)
  })

  it('muestra el CVV enmascarado en el reverso', () => {
    const wrapper = mount(CreditCardVisual, {
      props: { ...defaultProps, cardCvv: '456', showBack: true },
    })
    expect(wrapper.html()).toContain('•••')
  })
})
