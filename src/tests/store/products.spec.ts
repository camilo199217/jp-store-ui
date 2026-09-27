import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import productsModule from '@/store/modules/products.js'

vi.mock('@/services/api.js', () => ({
  productsApi: {
    getAll: vi.fn(),
  },
}))

import { productsApi } from '@/services/api.js'

const mockProducts = [
  { id: '1', name: 'Producto A', priceInCents: 100000, stock: 5, isAvailable: true, imageUrl: '', description: '' },
  { id: '2', name: 'Producto B', priceInCents: 200000, stock: 0, isAvailable: true, imageUrl: '', description: '' },
]

describe('products store module', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    store = createStore({ modules: { products: productsModule } })
  })

  it('estado inicial tiene items vacío', () => {
    expect(store.state.products.items).toHaveLength(0)
  })

  it('fetchProducts actualiza los items en el store', async () => {
    vi.mocked(productsApi.getAll).mockResolvedValue({
      items: mockProducts, total: 2, page: 1, totalPages: 1, limit: 9,
    })

    await store.dispatch('products/fetchProducts')

    expect(store.state.products.items).toHaveLength(2)
    expect(store.state.products.items[0].name).toBe('Producto A')
  })

  it('fetchProducts pone loading=true durante la carga y false al terminar', async () => {
    let resolveProducts!: (v: any) => void
    const pending = new Promise(resolve => { resolveProducts = resolve })
    vi.mocked(productsApi.getAll).mockReturnValue(pending as any)

    const fetchPromise = store.dispatch('products/fetchProducts')
    expect(store.state.products.loading).toBe(true)

    resolveProducts({ items: [], total: 0, page: 1, totalPages: 1, limit: 9 })
    await fetchPromise

    expect(store.state.products.loading).toBe(false)
  })

  it('fetchProducts guarda el error code en state.error si la API falla', async () => {
    vi.mocked(productsApi.getAll).mockRejectedValue(new Error('NETWORK_ERROR'))

    await store.dispatch('products/fetchProducts')

    expect(store.state.products.error).toBe('NETWORK_ERROR')
  })

  it('selectProduct guarda el producto en selectedProduct', async () => {
    await store.dispatch('products/selectProduct', mockProducts[0])

    expect(store.getters['products/selectedProduct']).toEqual(mockProducts[0])
  })

  it('hasMore es false cuando currentPage === totalPages', async () => {
    vi.mocked(productsApi.getAll).mockResolvedValue({
      items: mockProducts, total: 2, page: 1, totalPages: 1, limit: 9,
    })
    await store.dispatch('products/fetchProducts')

    expect(store.getters['products/hasMore']).toBe(false)
  })
})
