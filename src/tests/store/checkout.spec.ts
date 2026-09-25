// Test del módulo Vuex checkout.
// Practica: testear flujos asíncronos en Vuex y persistencia en sessionStorage.
import { describe, it, expect, vi, beforeEach } from 'vitest'
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

describe('checkout store module', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    sessionStorage.clear()
    store = createStore({
      modules: {
        checkout: checkoutModule,
        // Mock mínimo del módulo products para que getters funcione
        products: {
          namespaced: true,
          state: () => ({ selectedProduct: { id: 'p1', priceInCents: 29000000 } }),
          getters: { selectedProduct: (s: any) => s.selectedProduct },
          mutations: {},
          actions: {},
        },
      },
    })
  })

  it('estado inicial es step=products', () => {
    // TODO: verifica store.state.checkout.step === 'products'
  })

  it('saveFormData actualiza formData en el store', () => {
    // TODO: dispatch 'checkout/saveFormData' con datos de prueba
    // verifica que store.state.checkout.formData tenga esos datos
  })

  it('submitCheckout crea cliente y tokeniza tarjeta con el gateway de pago', async () => {
    // TODO: mockea customersApi.create → mockCustomer
    //       paymentApi.getAcceptanceToken → 'token_acc'
    //       paymentApi.tokenizeCard → 'tok_card_123'
    // dispatch saveFormData con datos completos luego submitCheckout
    // verifica que step sea 'summary' y customer no sea null
  })

  it('submitCheckout guarda error en state si la tokenización falla', async () => {
    // TODO: mockea paymentApi.tokenizeCard para que lance un error
    // verifica state.checkout.error !== null
  })

  it('processPayment avanza a step=result', async () => {
    // TODO: mockea transactionsApi.processPayment con una respuesta exitosa
    // setea customer y cardToken en el estado
    // dispatch processPayment y verifica step === 'result'
  })

  it('reset limpia todo el estado y sessionStorage', () => {
    // TODO: pon algo en el store, dispatch reset
    // verifica que step volvió a 'products' y sessionStorage esté vacío
  })

  it('no persiste datos de tarjeta en sessionStorage', () => {
    // TODO: guarda formData con cardNumber y cardCvv
    // verifica que sessionStorage no contenga esos valores
  })
})
