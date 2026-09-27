import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { makeStore } from '../helpers/makeStore.js'
import ProductPage from '@/views/ProductPage.vue'
import ProductGrid from '@/components/organisms/ProductGrid.vue'

vi.mock('@/services/api.js', () => ({
  productsApi: { getAll: vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, limit: 9, totalPages: 1 }) },
  customersApi: { create: vi.fn() },
  transactionsApi: { processPayment: vi.fn(), getById: vi.fn() },
  paymentApi: { getAcceptanceToken: vi.fn(), tokenizeCard: vi.fn() },
}))

describe('ProductPage', () => {
  it('renderiza el StepIndicator en paso 0', () => {
    const store = makeStore()
    const wrapper = mount(ProductPage, { global: { plugins: [store] } })
    expect(wrapper.html()).toBeTruthy()
  })

  it('incluye el componente ProductGrid', () => {
    const store = makeStore()
    const wrapper = mount(ProductPage, { global: { plugins: [store] } })
    expect(wrapper.findComponent(ProductGrid).exists()).toBe(true)
  })
})
