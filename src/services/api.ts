// Capa de servicios — todas las llamadas HTTP al backend pasan por aquí.
// Uso axios con interceptores para manejar errores de forma centralizada.
// Nunca llamo fetch() directamente desde los componentes.
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import type { ApiResponse, Product, PaginatedResult, Customer, Transaction } from '@/types/index.js'

// Instancia de axios configurada para nuestro backend
const http: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor de respuesta — desenvuelve el envelope { success, data, meta }
// y propaga el código de error si success === false
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => response,
  (error) => {
    // Si el backend nos respondió con un error estructurado, lo propago como código
    const code = error.response?.data?.error?.code ?? 'NETWORK_ERROR'
    return Promise.reject(new ApiServiceError(code, error.response?.status ?? 0))
  },
)

// Error tipado para que los stores puedan distinguir códigos sin parsear strings
export class ApiServiceError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
  ) {
    super(code)
    this.name = 'ApiServiceError'
  }
}

// ── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  // Obtiene la lista paginada de productos disponibles
  getAll: async (page = 1, limit = 9): Promise<PaginatedResult<Product>> => {
    const res = await http.get<ApiResponse<PaginatedResult<Product>>>('/products', {
      params: { page, limit },
    })
    return res.data.data
  },

  // Obtiene un producto por ID — lo uso para validar stock antes del pago
  getById: async (id: string): Promise<Product> => {
    const res = await http.get<ApiResponse<Product>>(`/products/${id}`)
    return res.data.data
  },
}

// ── Customers ─────────────────────────────────────────────────────────────────

export const customersApi = {
  // Crea el cliente durante el checkout — retorna el cliente con su ID
  create: async (data: {
    name: string
    email: string
    phone: string
    address: string
    city: string
  }): Promise<Customer> => {
    const res = await http.post<ApiResponse<Customer>>('/customers', data)
    return res.data.data
  },
}

// ── Transactions ──────────────────────────────────────────────────────────────

export const transactionsApi = {
  // Procesa el pago completo — este es el endpoint más crítico
  processPayment: async (data: {
    customerId: string
    productId: string
    cardToken: string
    acceptanceToken: string
    installments: number
    customerEmail: string
    quantity: number
  }): Promise<{ transaction: Transaction; gatewayStatus: string }> => {
    const res = await http.post<ApiResponse<{ transaction: Transaction; gatewayStatus: string }>>(
      '/transactions',
      data,
    )
    return res.data.data
  },

  // Obtiene una transacción por ID — para la resiliencia en refresh
  getById: async (id: string): Promise<Transaction> => {
    const res = await http.get<ApiResponse<Transaction>>(`/transactions/${id}`)
    return res.data.data
  },
}

// ── Payment Gateway (tokenización directa desde el frontend) ─────────────────
// La tokenización de la tarjeta ocurre aquí — los datos nunca llegan a nuestro backend

const PAYMENT_BASE = import.meta.env.VITE_PAYMENT_API_URL ?? 'https://api-sandbox.co.uat.wompi.dev/v1'

export const paymentApi = {
  // Obtiene el acceptance_token requerido en cada transacción
  getAcceptanceToken: async (): Promise<string> => {
    const pubKey = import.meta.env.VITE_PAYMENT_PUBLIC_KEY
    const res = await axios.get(`${PAYMENT_BASE}/merchants/${pubKey}`)
    return res.data.data.presigned_acceptance.acceptance_token
  },

  // Tokeniza la tarjeta directamente — nunca enviamos el número al backend
  tokenizeCard: async (cardData: {
    number: string
    cvc: string
    exp_month: string
    exp_year: string
    card_holder: string
  }): Promise<string> => {
    const pubKey = import.meta.env.VITE_PAYMENT_PUBLIC_KEY
    const res = await axios.post(
      `${PAYMENT_BASE}/tokens/cards`,
      cardData,
      { headers: { Authorization: `Bearer ${pubKey}` } },
    )
    return res.data.data.id
  },
}
