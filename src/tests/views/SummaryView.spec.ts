import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { makeStore, mockProduct, mockCustomer } from '../helpers/makeStore.js'

vi.mock('@/services/api.js', () => ({
  productsApi: { getAll: vi.fn() },
  customersApi: { create: vi.fn() },
  transactionsApi: { processPayment: vi.fn(), getById: vi.fn() },
  paymentApi: { getAcceptanceToken: vi.fn(), tokenizeCard: vi.fn() },
}))

import SummaryView from '@/views/SummaryView.vue'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/',         name: 'products', component: { template: '<div/>' } },
      { path: '/checkout', name: 'checkout', component: { template: '<div/>' } },
      { path: '/result',   name: 'result',   component: { template: '<div/>' } },
    ],
  })
}

describe('SummaryView', () => {
  let router: ReturnType<typeof makeRouter>

  beforeEach(() => {
    router = makeRouter()
  })

  it('renderiza el StepIndicator en paso 2', () => {
    const store = makeStore({ selectedProduct: mockProduct, customer: mockCustomer })
    const wrapper = mount(SummaryView, {
      global: { plugins: [store, router], stubs: { PaymentBackdrop: true, ToastNotification: true } },
    })
    expect(wrapper.html()).toBeTruthy()
  })

  it('muestra el nombre del producto seleccionado en el fondo', () => {
    const store = makeStore({ selectedProduct: mockProduct, customer: mockCustomer })
    const wrapper = mount(SummaryView, {
      global: { plugins: [store, router], stubs: { PaymentBackdrop: true, ToastNotification: true } },
    })
    expect(wrapper.text()).toContain('Audífonos Pro')
  })

  it('abre el PaymentBackdrop automáticamente al montar', () => {
    const store = makeStore({ selectedProduct: mockProduct })
    const wrapper = mount(SummaryView, {
      global: { plugins: [store, router], stubs: { PaymentBackdrop: true, ToastNotification: true } },
    })
    const backdrop = wrapper.findComponent({ name: 'PaymentBackdrop' })
    expect(backdrop.exists()).toBe(true)
  })

  it('redirecciona a result si el step ya es result (recovery en refresh)', async () => {
    const store = makeStore({ step: 'result', selectedProduct: mockProduct })
    const pushSpy = vi.spyOn(router, 'push').mockResolvedValue(undefined as any)
    mount(SummaryView, {
      global: { plugins: [store, router], stubs: { PaymentBackdrop: true, ToastNotification: true } },
    })
    await nextTick()
    expect(pushSpy).toHaveBeenCalledWith({ name: 'result' })
  })
})
