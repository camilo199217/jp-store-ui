// Store raíz de Vuex — registra todos los módulos.
// Sigo la arquitectura Flux: estado centralizado, mutaciones síncronas, acciones asíncronas.
import { createStore } from 'vuex'
import products from './modules/products.js'
import checkout from './modules/checkout.js'
import type { ProductsState } from './modules/products.js'
import type { CheckoutState } from './modules/checkout.js'

// Tipo del estado raíz para tipado estricto en los getters y actions
export interface RootState {
  products: ProductsState
  checkout: CheckoutState
}

export const store = createStore<RootState>({
  modules: {
    products,
    checkout,
  },
  // El modo estricto lanza error si se muta el estado fuera de una mutation
  strict: import.meta.env.DEV,
})
