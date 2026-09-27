// Módulo Vuex para el checkout — es el más crítico de la app.
// Persisto el estado en sessionStorage para la resiliencia en caso de refresh:
// si el usuario recarga en medio del proceso, recuperamos donde iba.
// Los datos de tarjeta NUNCA se guardan en storage — solo el token de pago.
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

// Clave de sessionStorage para persistencia durante la sesión
const STORAGE_KEY = 'checkout_session'

// Cargo el estado previo si existe (resiliencia en refresh)
function loadFromStorage(): Partial<CheckoutState> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Partial<CheckoutState>
    // Los datos de tarjeta sensibles nunca los persisto
    if (parsed.formData) {
      delete parsed.formData.cardNumber
      delete parsed.formData.cardCvv
      delete parsed.formData.cardToken
    }
    return parsed
  } catch {
    return {}
  }
}

function saveToStorage(state: CheckoutState): void {
  // Solo guardo lo necesario para recuperar el progreso — nunca datos de tarjeta
  const toSave = {
    step: state.step,
    customer: state.customer,
    transaction: state.transaction,
    gatewayStatus: state.gatewayStatus,
    formData: {
      // Solo datos no sensibles del formulario
      fullName: state.formData?.fullName,
      email: state.formData?.email,
      phone: state.formData?.phone,
      address: state.formData?.address,
      city: state.formData?.city,
    },
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
}

const saved = loadFromStorage()

const checkoutModule: Module<CheckoutState, RootState> = {
  namespaced: true,

  state: (): CheckoutState => ({
    step: saved.step ?? 'products',
    formData: saved.formData ?? {},
    customer: saved.customer ?? null,
    transaction: saved.transaction ?? null,
    gatewayStatus: saved.gatewayStatus ?? null,
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
      saveToStorage(state)
    },
    SET_FORM_DATA(state, data: Partial<CheckoutFormData>) {
      state.formData = { ...state.formData, ...data }
      saveToStorage(state)
    },
    SET_CUSTOMER(state, customer: Customer) {
      state.customer = customer
      saveToStorage(state)
    },
    SET_TRANSACTION(state, tx: Transaction) {
      state.transaction = tx
      saveToStorage(state)
    },
    SET_GATEWAY_STATUS(state, status: string) {
      state.gatewayStatus = status
      saveToStorage(state)
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
      sessionStorage.removeItem(STORAGE_KEY)
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
