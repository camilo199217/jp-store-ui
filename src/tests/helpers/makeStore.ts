import { createStore } from 'vuex'
import { vi } from 'vitest'
import type { Product, Customer, Transaction } from '@/types/index.js'

export interface StoreOverrides {
  selectedProduct?: Product | null
  selectedQuantity?: number
  loading?: boolean
  step?: string
  customer?: Customer | null
  transaction?: Transaction | null
  gatewayStatus?: string | null
  processing?: boolean
  error?: string | null
}

export function makeStore(overrides: StoreOverrides = {}) {
  return createStore({
    modules: {
      products: {
        namespaced: true,
        state: () => ({
          items: [] as Product[],
          total: 0,
          currentPage: 1,
          totalPages: 1,
          loading: overrides.loading ?? false,
          error: null,
          selectedProduct: overrides.selectedProduct ?? null,
          selectedQuantity: overrides.selectedQuantity ?? 1,
        }),
        getters: {
          selectedProduct:  (s: any) => s.selectedProduct,
          selectedQuantity: (s: any) => s.selectedQuantity,
          hasMore:          (s: any) => s.currentPage < s.totalPages,
        },
        mutations: {
          SET_LOADING:    (s: any, v: boolean)   => { s.loading = v },
          SET_ERROR:      (s: any, v: any)        => { s.error = v },
          SET_PRODUCTS:   (s: any, r: any)        => { s.items = r.items; s.total = r.total; s.currentPage = r.page; s.totalPages = r.totalPages },
          SELECT_PRODUCT: (s: any, p: any)        => { s.selectedProduct = p },
          CLEAR_SELECTED: (s: any)               => { s.selectedProduct = null },
          SET_QUANTITY:   (s: any, q: number)    => { s.selectedQuantity = q },
        },
        actions: {
          fetchProducts:  vi.fn().mockResolvedValue(undefined),
          selectProduct:  ({ commit }: any, p: any) => commit('SELECT_PRODUCT', p),
          setQuantity:    ({ commit }: any, q: number) => commit('SET_QUANTITY', q),
          reset:          ({ commit }: any) => commit('CLEAR_SELECTED'),
        },
      },
      checkout: {
        namespaced: true,
        state: () => ({
          step:          overrides.step          ?? 'products',
          formData:      {},
          customer:      overrides.customer      ?? null,
          transaction:   overrides.transaction   ?? null,
          gatewayStatus: overrides.gatewayStatus ?? null,
          processing:    overrides.processing    ?? false,
          error:         overrides.error         ?? null,
        }),
        getters: {
          currentStep:  (s: any) => s.step,
          isProcessing: (s: any) => s.processing,
          transaction:  (s: any) => s.transaction,
          gatewayStatus:(s: any) => s.gatewayStatus,
          error:        (s: any) => s.error,
          customer:     (s: any) => s.customer,
        },
        mutations: {
          SET_STEP:          (s: any, v: string)  => { s.step = v },
          SET_FORM_DATA:     (s: any, d: any)     => { s.formData = { ...s.formData, ...d } },
          SET_CUSTOMER:      (s: any, v: any)     => { s.customer = v },
          SET_TRANSACTION:   (s: any, v: any)     => { s.transaction = v },
          SET_GATEWAY_STATUS:(s: any, v: string)  => { s.gatewayStatus = v },
          SET_PROCESSING:    (s: any, v: boolean) => { s.processing = v },
          SET_ERROR:         (s: any, v: any)     => { s.error = v },
          RESET: (s: any) => {
            s.step = 'products'; s.transaction = null
            s.gatewayStatus = null; s.customer = null; s.formData = {}
          },
        },
        actions: {
          saveFormData:       ({ commit }: any, d: any) => commit('SET_FORM_DATA', d),
          submitCheckout:     vi.fn().mockResolvedValue(undefined),
          processPayment:     vi.fn().mockResolvedValue(undefined),
          reset:              ({ commit }: any) => commit('RESET'),
          goToStep:           ({ commit }: any, step: string) => commit('SET_STEP', step),
          recoverTransaction: vi.fn().mockResolvedValue(undefined),
        },
      },
    },
  })
}

export function makeRouter() {
  const { createRouter, createMemoryHistory } = require('vue-router')
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/',         name: 'products', component: { template: '<div/>' } },
      { path: '/checkout', name: 'checkout', component: { template: '<div/>' } },
      { path: '/summary',  name: 'summary',  component: { template: '<div/>' } },
      { path: '/result',   name: 'result',   component: { template: '<div/>' } },
    ],
  })
}

export const mockProduct: Product = {
  id: 'prod-1',
  name: 'Audífonos Pro',
  description: 'Sonido premium',
  priceInCents: 18990000,
  stock: 5,
  imageUrl: 'https://example.com/img.jpg',
  isAvailable: true,
}

export const mockCustomer: Customer = {
  id: 'cust-1',
  name: 'Juan Palacio',
  email: 'juan@test.com',
  phone: '3001234567',
  address: 'Calle 123 # 45-67',
  city: 'Bogotá',
}

export const mockTransaction: Transaction = {
  id: 'tx-1',
  customerId: 'cust-1',
  productId: 'prod-1',
  quantity: 1,
  status: 'APPROVED' as const,
  amountInCents: 18990000,
  baseFeeInCents: 1500000,
  deliveryFeeInCents: 890000,
  totalAmountInCents: 21380000,
  gatewayTransactionId: 'gw-tx-1',
  gatewayReference: 'REF-123',
  createdAt: '2026-01-01T00:00:00.000Z',
}
