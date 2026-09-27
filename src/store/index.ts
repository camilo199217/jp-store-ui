// Store raíz de Vuex — registra todos los módulos.
// Sigo la arquitectura Flux: estado centralizado, mutaciones síncronas, acciones asíncronas.
// La resiliencia en refresh se gestiona con vuex-persistedstate + secure-ls (AES):
// el estado de la sesión activa se cifra en localStorage antes de escribirse.
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from 'secure-ls'
import products from './modules/products.js'
import checkout from './modules/checkout.js'
import type { ProductsState } from './modules/products.js'
import type { CheckoutState } from './modules/checkout.js'

// Tipo del estado raíz para tipado estricto en los getters y actions
export interface RootState {
  products: ProductsState
  checkout: CheckoutState
}

// Storage cifrado — los datos del flujo de pago nunca quedan en texto plano en el navegador
const ls = new SecureLS({ encodingType: 'AES', isCompression: false })

export const store = createStore<RootState>({
  modules: {
    products,
    checkout,
  },
  // El modo estricto lanza error si se muta el estado fuera de una mutation
  strict: import.meta.env.DEV,
  plugins: [
    createPersistedState({
      storage: {
        getItem:    (key)        => ls.get(key),
        setItem:    (key, value) => ls.set(key, value),
        removeItem: (key)        => ls.remove(key),
      },
      // Controlo exactamente qué se cifra: nunca cardNumber ni cardCvv en crudo
      reducer: (state: RootState) => ({
        products: {
          selectedProduct:  state.products.selectedProduct,
          selectedQuantity: state.products.selectedQuantity,
        },
        checkout: {
          step:          state.checkout.step,
          customer:      state.checkout.customer,
          transaction:   state.checkout.transaction,
          gatewayStatus: state.checkout.gatewayStatus,
          formData: {
            // Datos de entrega — seguros de persistir
            fullName:     state.checkout.formData.fullName,
            email:        state.checkout.formData.email,
            phone:        state.checkout.formData.phone,
            address:      state.checkout.formData.address,
            city:         state.checkout.formData.city,
            cardName:     state.checkout.formData.cardName,
            cardExpiry:   state.checkout.formData.cardExpiry,
            installments: state.checkout.formData.installments,
            // Tokens de pago: cifrados por AES — nunca el número ni CVV real
            cardToken:        state.checkout.formData.cardToken,
            acceptanceToken:  state.checkout.formData.acceptanceToken,
          },
        },
      }),
    }),
  ],
})
