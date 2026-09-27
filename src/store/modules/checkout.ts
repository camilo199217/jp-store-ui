// Módulo Vuex para el checkout — es el más crítico de la app.
// La persistencia cifrada se gestiona en store/index.ts mediante vuex-persistedstate + secure-ls.
// Los datos de tarjeta en crudo (cardNumber, cardCvv) NUNCA salen de este módulo en memoria.
import type { Module } from 'vuex'
import type { RootState } from '../index.js'
import type { CheckoutFormData, Customer, Transaction } from '@/types/index.js'
import { customersApi, transactionsApi, paymentApi } from '@/services/api.js'

export type CheckoutStep = 'products' | 'checkout' | 'summary' | 'result'

export interface CheckoutState {
  step: CheckoutStep
  formData: Partial<CheckoutFormData>
  customer: Customer | null
  transaction: Transaction | null
  gatewayStatus: string | null
  processing: boolean
  error: string | null
}

const checkoutModule: Module<CheckoutState, RootState> = {
  namespaced: true,

  state: (): CheckoutState => ({
    step: 'products',
    formData: {},
    customer: null,
    transaction: null,
    gatewayStatus: null,
    processing: false,
    error: null,
  }),

  getters: {
    currentStep: (state) => state.step,
    isProcessing: (state) => state.processing,
    transaction: (state) => state.transaction,
    gatewayStatus: (state) => state.gatewayStatus,
    error: (state) => state.error,
    customer: (state) => state.customer,
  },

  mutations: {
    SET_STEP(state, step: CheckoutStep) {
      state.step = step
    },
    SET_FORM_DATA(state, data: Partial<CheckoutFormData>) {
      state.formData = { ...state.formData, ...data }
    },
    SET_CUSTOMER(state, customer: Customer) {
      state.customer = customer
    },
    SET_TRANSACTION(state, tx: Transaction) {
      state.transaction = tx
    },
    SET_GATEWAY_STATUS(state, status: string) {
      state.gatewayStatus = status
    },
    SET_PROCESSING(state, processing: boolean) { state.processing = processing },
    SET_ERROR(state, error: string | null) { state.error = error },
    RESET(state) {
      state.step = 'products'
      state.formData = {}
      state.customer = null
      state.transaction = null
      state.gatewayStatus = null
      state.processing = false
      state.error = null
    },
  },

  actions: {
    // Guarda los datos del formulario de checkout (paso 2)
    saveFormData({ commit }, data: Partial<CheckoutFormData>) {
      commit('SET_FORM_DATA', data)
    },

    // Avanza al resumen: crea el cliente y tokeniza la tarjeta
    async submitCheckout({ commit, state, rootGetters }) {
      commit('SET_PROCESSING', true)
      commit('SET_ERROR', null)

      try {
        const form = state.formData
        if (!form.fullName || !form.email || !form.phone || !form.address || !form.city) {
          commit('SET_ERROR', 'VALIDATION_ERROR')
          return
        }

        // 1. Crear el cliente en nuestro backend
        const customer = await customersApi.create({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
        })
        commit('SET_CUSTOMER', customer)

        // 2. Obtener acceptance_token del payment gateway (requerido por su API)
        const acceptanceToken = await paymentApi.getAcceptanceToken()

        // 3. Tokenizar la tarjeta directamente — los datos nunca van a nuestro backend
        const [expMonth, expYear] = (form.cardExpiry ?? '').split('/')
        const cardToken = await paymentApi.tokenizeCard({
          number: (form.cardNumber ?? '').replace(/\s/g, ''),
          cvc: form.cardCvv ?? '',
          exp_month: expMonth?.trim() ?? '',
          exp_year: expYear?.trim() ?? '',
          card_holder: form.cardName ?? '',
        })

        // 4. Guardar el token en el store (nunca el número real)
        commit('SET_FORM_DATA', { cardToken, acceptanceToken })
        commit('SET_STEP', 'summary')
      } catch (err: unknown) {
        const code = err instanceof Error ? err.message : 'UNKNOWN'
        commit('SET_ERROR', code)
      } finally {
        commit('SET_PROCESSING', false)
      }
    },

    // Procesa el pago (paso 3 → 4)
    async processPayment({ commit, state, rootGetters }) {
      commit('SET_PROCESSING', true)
      commit('SET_ERROR', null)

      try {
        const selectedProduct = rootGetters['products/selectedProduct']
        if (!state.customer || !selectedProduct) {
          commit('SET_ERROR', 'VALIDATION_ERROR')
          return
        }

        const selectedQuantity = rootGetters['products/selectedQuantity'] as number
        const [result] = await Promise.all([
          transactionsApi.processPayment({
            customerId: state.customer.id,
            productId: selectedProduct.id,
            cardToken: state.formData.cardToken ?? '',
            acceptanceToken: state.formData.acceptanceToken ?? '',
            installments: state.formData.installments ?? 1,
            customerEmail: state.customer.email,
            quantity: selectedQuantity ?? 1,
          }),
          // Tiempo mínimo para que la animación de procesamiento sea visible al usuario
          new Promise<void>(resolve => setTimeout(resolve, 3000)),
        ])

        commit('SET_TRANSACTION', result.transaction)
        commit('SET_GATEWAY_STATUS', result.gatewayStatus)
        commit('SET_STEP', 'result')
      } catch (err: unknown) {
        const code = err instanceof Error ? err.message : 'UNKNOWN'
        commit('SET_ERROR', code)
        commit('SET_STEP', 'result')
      } finally {
        commit('SET_PROCESSING', false)
      }
    },

    // Recupera una transacción existente si el usuario refrescó la página en el paso 4
    async recoverTransaction({ commit }, transactionId: string) {
      try {
        const tx = await transactionsApi.getById(transactionId)
        commit('SET_TRANSACTION', tx)
        commit('SET_GATEWAY_STATUS', tx.status)
      } catch {
        // Si no se encuentra la transacción, reiniciamos el flujo
        commit('RESET')
      }
    },

    goToStep({ commit }, step: CheckoutStep) {
      commit('SET_STEP', step)
    },

    reset({ commit }) {
      commit('RESET')
    },
  },
}

export default checkoutModule
