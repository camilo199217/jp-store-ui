import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '@/components/molecules/ProductCard.vue'
import type { Product } from '@/types/index.js'

const mockProduct: Product = {
  id: '123',
  name: 'Audífonos Pro',
  description: 'Sonido premium',
  priceInCents: 29990000,
  stock: 5,
  imageUrl: 'https://example.com/img.jpg',
  isAvailable: true,
}

describe('ProductCard', () => {
  it('muestra el nombre del producto', () => {
    const wrapper = mount(ProductCard, { props: { product: mockProduct } })

    expect(wrapper.text()).toContain('Audífonos Pro')
  })

  it('muestra el badge "En stock" cuando stock > 0', () => {
    const wrapper = mount(ProductCard, { props: { product: mockProduct } })

    expect(wrapper.text()).toContain('5 disponibles')
  })

  it('muestra el badge "Agotado" cuando stock === 0', () => {
    const wrapper = mount(ProductCard, { props: { product: { ...mockProduct, stock: 0 } } })

    expect(wrapper.text()).toContain('Agotado')
  })

  it('el botón "Comprar ahora" está deshabilitado cuando stock === 0', () => {
    const wrapper = mount(ProductCard, { props: { product: { ...mockProduct, stock: 0 } } })

    expect(wrapper.find('button').element.disabled).toBe(true)
  })

  it('emite el evento select con el producto al hacer clic en la tarjeta', async () => {
    const wrapper = mount(ProductCard, { props: { product: mockProduct } })

    await wrapper.find('article').trigger('click')

    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual(mockProduct)
  })

  it('emite el evento select al hacer clic en el botón de compra', async () => {
    const wrapper = mount(ProductCard, { props: { product: mockProduct } })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual(mockProduct)
  })

  it('formatea el precio en COP correctamente', () => {
    const wrapper = mount(ProductCard, { props: { product: mockProduct } })

    expect(wrapper.text()).toContain('299.900')
  })

  it('usa la imagen de fallback cuando la imagen falla', async () => {
    const wrapper = mount(ProductCard, { props: { product: mockProduct } })

    await wrapper.find('img').trigger('error')

    expect(wrapper.find('img').attributes('src')).toContain('unsplash.com')
  })
})
