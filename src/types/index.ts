// Tipos compartidos de la aplicación — espejo de las entidades del backend.
// Los mantengo separados para no acoplar el frontend a la estructura interna del backend.

export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  stock: number
  imageUrl: string
  isAvailable: boolean
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
}

export type TransactionStatus = 'CREATED' | 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR'

export interface Transaction {
  id: string
  customerId: string
  productId: string
  status: TransactionStatus
  amountInCents: number
  baseFeeInCents: number
  deliveryFeeInCents: number
  totalAmountInCents: number
  gatewayTransactionId: string | null
  gatewayReference: string
  createdAt: string
}

export interface Delivery {
  id: string
  transactionId: string
  customerId: string
  productId: string
  address: string
  city: string
  status: 'PENDING' | 'ASSIGNED' | 'DELIVERED'
}

// Datos del formulario de checkout
export interface CheckoutFormData {
  // Tarjeta
  cardNumber: string
  cardName: string
  cardExpiry: string
  cardCvv: string
  cardToken: string
  acceptanceToken: string
  installments: number
  quantity: number
  // Cliente / entrega
  fullName: string
  email: string
  phone: string
  address: string
  city: string
}

// Respuesta estándar del backend
export interface ApiResponse<T> {
  success: boolean
  data: T
  meta: { timestamp: string }
}

export interface ApiError {
  success: false
  error: { code: string }
  meta: { timestamp: string }
}

// Tipo de marca de tarjeta detectada en tiempo real
export type CardBrand = 'visa' | 'mastercard' | 'unknown'
