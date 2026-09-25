// Módulo Vuex para productos — maneja la lista paginada de la tienda.
// Persisto los productos en memoria durante la sesión para no repetir llamadas innecesarias.
import type { Module } from 'vuex'
import type { RootState } from '../index.js'
import type { Product, PaginatedResult } from '@/types/index.js'
import { productsApi } from '@/services/api.js'

export interface ProductsState {
  items: Product[]
  total: number
  currentPage: number
  totalPages: number
  loading: boolean
  error: string | null
  selectedProduct: Product | null
  selectedQuantity: number
}

const productsModule: Module<ProductsState, RootState> = {
  namespaced: true,

  state: (): ProductsState => ({
    items: [],
    total: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    selectedProduct: null,
    selectedQuantity: 1,
  }),

  getters: {
    // Verifica si hay más páginas por cargar
    hasMore: (state) => state.currentPage < state.totalPages,

    // Retorna el producto seleccionado para el checkout
    selectedProduct: (state) => state.selectedProduct,

    // Retorna la cantidad seleccionada para el checkout
    selectedQuantity: (state) => state.selectedQuantity,
  },

  mutations: {
    SET_LOADING(state, loading: boolean) { state.loading = loading },
    SET_ERROR(state, error: string | null) { state.error = error },

    // Reemplaza la lista completa (al cambiar página)
    SET_PRODUCTS(state, result: PaginatedResult<Product>) {
      state.items = result.items
      state.total = result.total
      state.currentPage = result.page
      state.totalPages = result.totalPages
    },

    SELECT_PRODUCT(state, product: Product) { state.selectedProduct = product },
    CLEAR_SELECTED(state) { state.selectedProduct = null },
    SET_QUANTITY(state, quantity: number) { state.selectedQuantity = quantity },
  },

  actions: {
    // Carga productos paginados
    async fetchProducts({ commit }, page = 1) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const result = await productsApi.getAll(page, 9)
        commit('SET_PRODUCTS', result)
      } catch (err: unknown) {
        const code = err instanceof Error ? err.message : 'UNKNOWN'
        commit('SET_ERROR', code)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Selecciona el producto que el usuario quiere comprar y resetea la cantidad
    selectProduct({ commit }, product: Product) {
      commit('SELECT_PRODUCT', product)
      commit('SET_QUANTITY', 1)
    },

    // Actualiza la cantidad seleccionada (mínimo 1, máximo stock del producto)
    setQuantity({ commit }, quantity: number) {
      commit('SET_QUANTITY', quantity)
    },
  },
}

export default productsModule
