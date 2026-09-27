import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { makeStore, mockProduct } from '../helpers/makeStore.js'

vi.mock('@/services/api.js', () => ({
  productsApi: { getAll: vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, limit: 9, totalPages: 1 }) },
  customersApi: { create: vi.fn() },
  transactionsApi: { processPayment: vi.fn(), getById: vi.fn() },
  paymentApi: { getAcceptanceToken: vi.fn(), tokenizeCard: vi.fn() },
}))

import ProductGrid from '@/components/organisms/ProductGrid.vue'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/',         name: 'products', component: { template: '<div/>' } },
      { path: '/checkout', name: 'checkout', component: { template: '<div/>' } },
    ],
  })
}

describe('ProductGrid', () => {
  let router: ReturnType<typeof makeRouter>

  beforeEach(() => {
    router = makeRouter()
  })

  it('dispara fetchProducts al montar', () => {
    const store = makeStore()
    const fetchSpy = vi.spyOn(store, 'dispatch')
    mount(ProductGrid, { global: { plugins: [store, router] } })
    expect(fetchSpy).toHaveBeenCalledWith('products/fetchProducts', 1)
  })

  it('muestra los skeletons cuando está cargando y no hay productos', () => {
    const store = makeStore({ loading: true })
    const wrapper = mount(ProductGrid, { global: { plugins: [store, router] } })
    expect(wrapper.html()).toContain('skeleton')
  })

  it('muestra los productos cuando el store tiene items', () => {
    const store = makeStore()
    store.commit('products/SET_PRODUCTS', {
      items: [mockProduct],
      total: 1,
      page: 1,
      limit: 9,
      totalPages: 1,
    })
    const wrapper = mount(ProductGrid, { global: { plugins: [store, router] } })
    expect(wrapper.text()).toContain('Audífonos Pro')
  })

  it('navega a checkout al seleccionar un producto', async () => {
    const store = makeStore()
    store.commit('products/SET_PRODUCTS', {
      items: [mockProduct], total: 1, page: 1, limit: 9, totalPages: 1,
    })
    const pushSpy = vi.spyOn(router, 'push')
    const wrapper = mount(ProductGrid, { global: { plugins: [store, router] } })
    // Emitir el evento 'select' directamente desde el componente ProductCard
    await wrapper.findComponent({ name: 'ProductCard' }).vm.$emit('select', mockProduct)
    await nextTick()
    expect(pushSpy).toHaveBeenCalledWith({ name: 'checkout' })
  })

  it('muestra paginación cuando hay más de una página', () => {
    const store = makeStore()
    store.commit('products/SET_PRODUCTS', {
      items: [mockProduct],
      total: 20,
      page: 1,
      limit: 9,
      totalPages: 3,
    })
    const wrapper = mount(ProductGrid, { global: { plugins: [store, router] } })
    expect(wrapper.text()).toContain('Siguiente')
  })
})
