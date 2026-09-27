import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { makeStore, mockProduct } from '../helpers/makeStore.js'

vi.mock('@/services/api.js', () => ({
  productsApi: { getAll: vi.fn() },
  customersApi: { create: vi.fn() },
  transactionsApi: { processPayment: vi.fn(), getById: vi.fn() },
  paymentApi: { getAcceptanceToken: vi.fn(), tokenizeCard: vi.fn() },
}))

import CheckoutView from '@/views/CheckoutView.vue'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/',         name: 'products', component: { template: '<div/>' } },
      { path: '/checkout', name: 'checkout', component: CheckoutView },
    ],
  })
}

describe('CheckoutView', () => {
  let router: ReturnType<typeof makeRouter>

  beforeEach(async () => {
    router = makeRouter()
    await router.push('/checkout')
    await router.isReady()
  })

  it('renderiza el formulario de checkout', () => {
    const store = makeStore({ selectedProduct: mockProduct })
    const wrapper = mount(CheckoutView, {
      global: {
        plugins: [store, router],
        stubs: { CheckoutForm: true, DevDrawer: true },
      },
    })
    expect(wrapper.html()).toBeTruthy()
  })

  it('muestra el nombre del producto seleccionado', () => {
    const store = makeStore({ selectedProduct: mockProduct })
    const wrapper = mount(CheckoutView, {
      global: {
        plugins: [store, router],
        stubs: { CheckoutForm: true, DevDrawer: true },
      },
    })
    expect(wrapper.text()).toContain('Audífonos Pro')
  })

  it('muestra el precio del producto formateado', () => {
    const store = makeStore({ selectedProduct: mockProduct })
    const wrapper = mount(CheckoutView, {
      global: {
        plugins: [store, router],
        stubs: { CheckoutForm: true, DevDrawer: true },
      },
    })
    expect(wrapper.text()).toContain('189.900')
  })

  it('incrementa la cantidad al hacer clic en "+"', async () => {
    const store = makeStore({ selectedProduct: mockProduct, selectedQuantity: 1 })
    const wrapper = mount(CheckoutView, {
      global: {
        plugins: [store, router],
        stubs: { CheckoutForm: true, DevDrawer: true },
      },
    })
    const buttons = wrapper.findAll('button')
    const incrementBtn = buttons.find(b => b.text() === '+')
    await incrementBtn?.trigger('click')
    expect(store.state.products.selectedQuantity).toBe(2)
  })

  it('decrementa la cantidad al hacer clic en "−"', async () => {
    const store = makeStore({ selectedProduct: mockProduct, selectedQuantity: 3 })
    const wrapper = mount(CheckoutView, {
      global: {
        plugins: [store, router],
        stubs: { CheckoutForm: true, DevDrawer: true },
      },
    })
    const buttons = wrapper.findAll('button')
    const decrementBtn = buttons.find(b => b.text() === '−')
    await decrementBtn?.trigger('click')
    expect(store.state.products.selectedQuantity).toBe(2)
  })

  it('deshabilita el botón "−" cuando la cantidad es 1', () => {
    const store = makeStore({ selectedProduct: mockProduct, selectedQuantity: 1 })
    const wrapper = mount(CheckoutView, {
      global: {
        plugins: [store, router],
        stubs: { CheckoutForm: true, DevDrawer: true },
      },
    })
    const buttons = wrapper.findAll('button')
    const decrementBtn = buttons.find(b => b.text() === '−')
    expect(decrementBtn?.element.disabled).toBe(true)
  })
})
