// Test del módulo Vuex products.
// Practica: testear Vuex con stores reales (no mocks del store).
// Mockeo solo las llamadas HTTP con vi.mock().
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import productsModule from '@/store/modules/products.js'

// Mock del módulo de API para no hacer llamadas HTTP reales
vi.mock('@/services/api.js', () => ({
  productsApi: {
    getAll: vi.fn(),
  },
}))

// Importo después del mock para que Vitest use la versión mockeada
import { productsApi } from '@/services/api.js'

const mockProducts = [
  { id: '1', name: 'Producto A', priceInCents: 100000, stock: 5, isAvailable: true, imageUrl: '', description: '' },
  { id: '2', name: 'Producto B', priceInCents: 200000, stock: 0, isAvailable: true, imageUrl: '', description: '' },
]

describe('products store module', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    // Creo un store fresco antes de cada test para evitar estado compartido
    store = createStore({ modules: { products: productsModule } })
  })

  it('estado inicial tiene items vacío', () => {
    // TODO: verifica store.state.products.items.length === 0
  })

  it('fetchProducts actualiza los items en el store', async () => {
    // TODO: mockea productsApi.getAll para que resuelva con { items: mockProducts, total: 2, page: 1, totalPages: 1, limit: 9 }
    // dispatch 'products/fetchProducts'
    // verifica store.state.products.items
  })

  it('fetchProducts pone loading=true durante la carga y false al terminar', async () => {
    // TODO: con una promesa que puedes controlar, verifica el estado de loading
  })

  it('fetchProducts guarda el error code en state.error si la API falla', async () => {
    // TODO: mockea getAll para que rechace con new Error('NETWORK_ERROR')
    // y verifica store.state.products.error === 'NETWORK_ERROR'
  })

  it('selectProduct guarda el producto en selectedProduct', () => {
    // TODO: dispatch 'products/selectProduct' con mockProducts[0]
    // verifica store.getters['products/selectedProduct']
  })

  it('hasMore es false cuando currentPage === totalPages', () => {
    // TODO: usa commit para poner currentPage=1, totalPages=1
    // y verifica store.getters['products/hasMore'] === false
  })
})
