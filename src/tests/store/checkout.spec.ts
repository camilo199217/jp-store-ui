import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createStore } from 'vuex'
import checkoutModule from '@/store/modules/checkout.js'

vi.mock('@/services/api.js', () => ({
  customersApi: { create: vi.fn() },
  transactionsApi: { processPayment: vi.fn(), getById: vi.fn() },
  paymentApi: { getAcceptanceToken: vi.fn(), tokenizeCard: vi.fn() },
}))

import { customersApi, transactionsApi, paymentApi } from '@/services/api.js'

const mockCustomer = { id: 'c1', name: 'Juan', email: 'juan@test.com', phone: '3001234567', address: 'Calle 1', city: 'Bogotá' }
const mockTransaction = { id: 't1', status: 'APPROVED', totalAmountInCents: 30000000, gatewayReference: 'ref123', amountInCents: 29000000, baseFeeInCents: 300000, deliveryFeeInCents: 500000, customerId: 'c1', productId: 'p1', gatewayTransactionId: 'gw1', createdAt: '' }

const fullFormData = {
  fullName: 'Juan Palacio',
  email: 'juan@test.com',
  phone: '3001234567',
  address: 'Calle 1',
  city: 'Bogotá',
  cardNumber: '4111 1111 1111 1111',
  cardCvv: '123',
  cardExpiry: '12/28',
  cardName: 'JUAN PALACIO',
}

describe('checkout store module', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    vi.useFakeTimers()
    sessionStorage.clear()
    store = createStore({
      modules: {
        checkout: checkoutModule,
        products: {
          namespaced: true,
          state: () => ({ selectedProduct: { id: 'p1', priceInCents: 29000000 }, selectedQuantity: 1 }),
          getters: {
            selectedProduct: (s: any) => s.selectedProduct,
            selectedQuantity: (s: any) => s.selectedQuantity,
          },
          mutations: {},
          actions: {},
        },
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('estado inicial es step=products', () => {
    expect(store.state.checkout.step).toBe('products')
  })

  it('saveFormData actualiza formData en el store', async () => {
    await store.dispatch('checkout/saveFormData', { email: 'juan@test.com', fullName: 'Juan' })

    expect(store.state.checkout.formData.email).toBe('juan@test.com')
    expect(store.state.checkout.formData.fullName).toBe('Juan')
  })

  it('submitCheckout crea cliente y tokeniza tarjeta con el gateway de pago', async () => {
    vi.mocked(customersApi.create).mockResolvedValue(mockCustomer)
    vi.mocked(paymentApi.getAcceptanceToken).mockResolvedValue('token_acc')
    vi.mocked(paymentApi.tokenizeCard).mockResolvedValue('tok_card_123')

    await store.dispatch('checkout/saveFormData', fullFormData)
    await store.dispatch('checkout/submitCheckout')

    expect(store.state.checkout.step).toBe('summary')
    expect(store.state.checkout.customer).not.toBeNull()
  })

  it('submitCheckout guarda error en state si la tokenización falla', async () => {
    vi.mocked(customersApi.create).mockResolvedValue(mockCustomer)
    vi.mocked(paymentApi.getAcceptanceToken).mockResolvedValue('token_acc')
    vi.mocked(paymentApi.tokenizeCard).mockRejectedValue(new Error('TOKEN_FAILED'))

    await store.dispatch('checkout/saveFormData', fullFormData)
    await store.dispatch('checkout/submitCheckout')

    expect(store.state.checkout.error).toBe('TOKEN_FAILED')
  })

  it('processPayment avanza a step=result', async () => {
    vi.mocked(transactionsApi.processPayment).mockResolvedValue({
      transaction: mockTransaction,
      gatewayStatus: 'APPROVED',
    })

    store.commit('checkout/SET_CUSTOMER', mockCustomer)
    store.commit('checkout/SET_FORM_DATA', { cardToken: 'tok_123', acceptanceToken: 'acc_xyz' })

    const promise = store.dispatch('checkout/processPayment')
    vi.advanceTimersByTime(3000)
    await promise

    expect(store.state.checkout.step).toBe('result')
  })

  it('reset limpia todo el estado y sessionStorage', async () => {
    store.commit('checkout/SET_STEP', 'summary')

    await store.dispatch('checkout/reset')

    expect(store.state.checkout.step).toBe('products')
    expect(sessionStorage.getItem('checkout_session')).toBeNull()
  })

  it('no persiste datos de tarjeta en sessionStorage', async () => {
    await store.dispatch('checkout/saveFormData', {
      cardNumber: '4111 1111 1111 1111',
      cardCvv: '123',
      fullName: 'Juan',
      email: 'juan@test.com',
    })

    const stored = sessionStorage.getItem('checkout_session')
    expect(stored).not.toContain('4111')
    expect(stored).not.toContain('123')
  })
})
