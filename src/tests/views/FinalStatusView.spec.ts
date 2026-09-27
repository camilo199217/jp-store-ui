import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { makeStore, mockTransaction, mockCustomer } from '../helpers/makeStore.js'

vi.mock('canvas-confetti', () => ({ default: vi.fn() }))
vi.mock('@/services/api.js', () => ({
  productsApi: { getAll: vi.fn() },
  customersApi: { create: vi.fn() },
  transactionsApi: { processPayment: vi.fn(), getById: vi.fn().mockResolvedValue({ ...mockTransaction, status: 'APPROVED' }) },
  paymentApi: { getAcceptanceToken: vi.fn(), tokenizeCard: vi.fn() },
}))

import FinalStatusView from '@/views/FinalStatusView.vue'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/',         name: 'products', component: { template: '<div/>' } },
      { path: '/checkout', name: 'checkout', component: { template: '<div/>' } },
      { path: '/result',   name: 'result',   component: FinalStatusView },
    ],
  })
}

describe('FinalStatusView', () => {
  let router: ReturnType<typeof makeRouter>

  beforeEach(() => {
    router = makeRouter()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('muestra el ícono y título de éxito cuando el pago es APPROVED', async () => {
    const store = makeStore({
      gatewayStatus: 'APPROVED',
      transaction: { ...mockTransaction, status: 'APPROVED' },
      customer: mockCustomer,
    })
    const wrapper = mount(FinalStatusView, { global: { plugins: [store, router] } })
    expect(wrapper.html()).toContain('Pago exitoso')
  })

  it('muestra detalles de la transacción cuando está disponible', () => {
    const store = makeStore({
      gatewayStatus: 'APPROVED',
      transaction: { ...mockTransaction, status: 'APPROVED' },
      customer: mockCustomer,
    })
    const wrapper = mount(FinalStatusView, { global: { plugins: [store, router] } })
    expect(wrapper.html()).toContain('REF-123')
  })

  it('muestra el total pagado formateado', () => {
    const store = makeStore({
      gatewayStatus: 'APPROVED',
      transaction: { ...mockTransaction, status: 'APPROVED', totalAmountInCents: 21380000 },
    })
    const wrapper = mount(FinalStatusView, { global: { plugins: [store, router] } })
    expect(wrapper.text()).toContain('213.800')
  })

  it('muestra el estado DECLINED con ícono de advertencia', () => {
    const store = makeStore({
      gatewayStatus: 'DECLINED',
      transaction: { ...mockTransaction, status: 'DECLINED' },
    })
    const wrapper = mount(FinalStatusView, { global: { plugins: [store, router] } })
    expect(wrapper.html()).toContain('bg-warning')
  })

  it('muestra el estado ERROR con ícono de error', () => {
    const store = makeStore({
      gatewayStatus: 'ERROR',
      transaction: { ...mockTransaction, status: 'ERROR' },
    })
    const wrapper = mount(FinalStatusView, { global: { plugins: [store, router] } })
    expect(wrapper.html()).toContain('bg-danger')
  })

  it('muestra el estado PENDING con spinner de polling', () => {
    const store = makeStore({
      gatewayStatus: 'PENDING',
      transaction: { ...mockTransaction, status: 'PENDING' },
    })
    const wrapper = mount(FinalStatusView, { global: { plugins: [store, router] } })
    expect(wrapper.html()).toContain('Verificando pago')
  })

  it('el botón "Seguir comprando" navega a products (APPROVED)', async () => {
    const store = makeStore({
      gatewayStatus: 'APPROVED',
      transaction: { ...mockTransaction, status: 'APPROVED' },
    })
    const pushSpy = vi.spyOn(router, 'push').mockResolvedValue(undefined as any)
    const wrapper = mount(FinalStatusView, { global: { plugins: [store, router] } })
    await wrapper.find('button').trigger('click')
    expect(pushSpy).toHaveBeenCalledWith({ name: 'products' })
  })

  it('el botón "Intentar de nuevo" navega a checkout (DECLINED)', async () => {
    const store = makeStore({
      gatewayStatus: 'DECLINED',
      transaction: { ...mockTransaction, status: 'DECLINED' },
    })
    const pushSpy = vi.spyOn(router, 'push').mockResolvedValue(undefined as any)
    const wrapper = mount(FinalStatusView, { global: { plugins: [store, router] } })
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    expect(pushSpy).toHaveBeenCalled()
  })
})
