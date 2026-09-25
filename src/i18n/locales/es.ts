// Todos los textos de la app centralizados aquí.
// El backend no maneja textos — solo códigos. Esta es la fuente de verdad de los mensajes.
export default {
  // ── Navegación / Steps ────────────────────────────────────────────────────
  steps: {
    products: 'Productos',
    checkout: 'Pago',
    summary: 'Resumen',
    result: 'Resultado',
  },

  // ── Página de productos ───────────────────────────────────────────────────
  products: {
    title: 'Nuestra Tienda',
    subtitle: 'Tecnología premium para tu día a día',
    inStock: '{n} disponibles',
    outOfStock: 'Agotado',
    buy: 'Comprar ahora',
    price: '${price} COP',
    loadingMore: 'Cargando más productos...',
    noMore: 'Has visto todos los productos',
    page: 'Página {current} de {total}',
  },

  // ── Formulario de pago ────────────────────────────────────────────────────
  checkout: {
    title: 'Información de pago',
    subtitle: 'Tus datos están cifrados y seguros',
    cardSection: 'Datos de tarjeta',
    deliverySection: 'Datos de entrega',
    cardNumber: 'Número de tarjeta',
    cardName: 'Nombre en la tarjeta',
    cardExpiry: 'Vencimiento',
    cardCvv: 'CVV',
    cardNumberPlaceholder: '1234 5678 9012 3456',
    cardNamePlaceholder: 'Como aparece en la tarjeta',
    cardExpiryPlaceholder: 'MM/AA',
    cardCvvPlaceholder: '•••',
    fullName: 'Nombre completo',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    address: 'Dirección de entrega',
    city: 'Ciudad',
    fullNamePlaceholder: 'Tu nombre completo',
    emailPlaceholder: 'tucorreo@email.com',
    phonePlaceholder: '300 123 4567',
    addressPlaceholder: 'Calle 123 # 45-67',
    cityPlaceholder: 'Bogotá',
    next: 'Ver resumen',
    back: 'Volver',
    securePayment: 'Pago 100% seguro',
    encrypted: 'Cifrado SSL',
  },

  // ── Resumen de pago (Backdrop) ────────────────────────────────────────────
  summary: {
    title: 'Resumen de tu orden',
    product: 'Producto',
    baseFee: 'Tarifa base',
    deliveryFee: 'Envío',
    total: 'Total a pagar',
    installments: 'Cuotas',
    oneInstallment: '1 cuota (sin intereses)',
    pay: 'Pagar ahora',
    cancel: 'Cancelar',
    processing: 'Procesando pago...',
    processingHint: 'Estamos verificando tu tarjeta de forma segura. No cierres esta ventana.',
  },

  // ── Estado final ──────────────────────────────────────────────────────────
  result: {
    approved: {
      title: '¡Pago exitoso!',
      subtitle: 'Tu pedido está confirmado y en camino',
      message: 'Recibirás una confirmación en tu correo electrónico.',
    },
    declined: {
      title: 'Pago rechazado',
      subtitle: 'Tu tarjeta no fue aprobada',
      message: 'Verifica los datos de tu tarjeta e intenta de nuevo.',
    },
    pending: {
      title: 'Pago en proceso',
      subtitle: 'Tu transacción está siendo verificada',
      message: 'Recibirás una confirmación cuando el pago sea aprobado.',
    },
    error: {
      title: 'Ocurrió un error',
      subtitle: 'No pudimos procesar tu pago',
      message: 'Por favor intenta nuevamente en unos minutos.',
    },
    transactionId: 'N° de transacción',
    deliveryAddress: 'Dirección de entrega',
    backToStore: 'Volver a la tienda',
    tryAgain: 'Intentar de nuevo',
  },

  // ── Errores de API (códigos del backend) ─────────────────────────────────
  errors: {
    PRODUCT_NOT_FOUND: 'El producto no fue encontrado.',
    INSUFFICIENT_STOCK: 'No hay suficiente stock disponible. El producto puede haberse agotado.',
    PRODUCT_NOT_AVAILABLE: 'Este producto no está disponible actualmente.',
    TRANSACTION_NOT_FOUND: 'La transacción no fue encontrada.',
    DUPLICATE_TRANSACTION: 'Ya existe una transacción en proceso.',
    TRANSACTION_ALREADY_PROCESSED: 'Esta transacción ya fue procesada.',
    PAYMENT_DECLINED: 'Tu tarjeta fue rechazada. Verifica los datos.',
    PAYMENT_ERROR: 'Error al procesar el pago. Intenta de nuevo.',
    CUSTOMER_NOT_FOUND: 'No se encontró la información del cliente.',
    VALIDATION_ERROR: 'Verifica que todos los campos estén correctos.',
    INVALID_CARD_TOKEN: 'Los datos de la tarjeta no son válidos.',
    INTERNAL_ERROR: 'Error interno. Por favor intenta más tarde.',
    PAYMENT_GATEWAY_UNAVAILABLE: 'El servicio de pagos no está disponible. Intenta en unos minutos.',
    NETWORK_ERROR: 'Error de conexión. Verifica tu internet e intenta de nuevo.',
    DUPLICATE_RESOURCE: 'Ya existe un registro con esos datos.',
    CONSTRAINT_VIOLATION: 'Los datos enviados no cumplen las reglas del negocio.',
    UNKNOWN: 'Ocurrió un error inesperado.',
  },

  // ── Validaciones ──────────────────────────────────────────────────────────
  validation: {
    required: 'Este campo es requerido',
    email: 'Ingresa un correo válido',
    phone: 'Ingresa un teléfono válido (7-15 dígitos)',
    cardNumber: 'Número de tarjeta inválido',
    cardExpiry: 'Fecha de vencimiento inválida',
    cardCvv: 'CVV inválido',
    cardName: 'Ingresa el nombre como aparece en la tarjeta',
    minLength: 'Mínimo {min} caracteres',
    address: 'Ingresa una dirección válida',
    city: 'Ingresa una ciudad válida',
  },

  // ── Misceláneos ───────────────────────────────────────────────────────────
  common: {
    loading: 'Cargando...',
    error: 'Algo salió mal',
    retry: 'Intentar de nuevo',
    close: 'Cerrar',
    currency: 'COP',
  },
}
