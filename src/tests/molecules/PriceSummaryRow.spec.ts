import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PriceSummaryRow from '@/components/molecules/PriceSummaryRow.vue'

describe('PriceSummaryRow', () => {
  it('renderiza la etiqueta correctamente', () => {
    const wrapper = mount(PriceSummaryRow, {
      props: { label: 'Subtotal', amountInCents: 50000 },
    })
    expect(wrapper.text()).toContain('Subtotal')
  })

  it('formatea el monto en centavos a pesos colombianos', () => {
    const wrapper = mount(PriceSummaryRow, {
      props: { label: 'Total', amountInCents: 100000 },
    })
    expect(wrapper.text()).toContain('1.000')
  })

  it('aplica estilos de fila normal cuando isTotal=false (default)', () => {
    const wrapper = mount(PriceSummaryRow, {
      props: { label: 'Envío', amountInCents: 89000 },
    })
    expect(wrapper.html()).toContain('text-ink-400')
    expect(wrapper.html()).not.toContain('border-t')
  })

  it('aplica estilos de total con borde cuando isTotal=true', () => {
    const wrapper = mount(PriceSummaryRow, {
      props: { label: 'Total', amountInCents: 200000, isTotal: true },
    })
    expect(wrapper.html()).toContain('border-t')
    expect(wrapper.html()).toContain('font-semibold')
  })

  it('muestra el precio en formato moneda COP', () => {
    const wrapper = mount(PriceSummaryRow, {
      props: { label: 'Precio', amountInCents: 18990000 },
    })
    expect(wrapper.text()).toContain('189.900')
  })
})
