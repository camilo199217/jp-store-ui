// Test del molecule ProductCard.
// Practica: montar componentes con props complejas y verificar eventos con datos.
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '@/components/molecules/ProductCard.vue'
import type { Product } from '@/types/index.js'

// Producto de prueba — lo reutilizo en varios tests
const mockProduct: Product = {
  id: '123',
  name: 'Audífonos Pro',
  description: 'Sonido premium',
  priceInCents: 29990000,
  stock: 5,
  imageUrl: 'https://example.com/img.jpg',
  isAvailable: true,
}

describe('ProductCard', () => {
  it('muestra el nombre del producto', () => {
    // TODO: monta con :product="mockProduct" y verifica que aparezca 'Audífonos Pro'
  })

  it('muestra el badge "En stock" cuando stock > 0', () => {
    // TODO: verifica que el badge de stock aparezca con el stock correcto
  })

  it('muestra el badge "Agotado" cuando stock === 0', () => {
    // TODO: crea un producto con stock: 0 y verifica el badge de agotado
  })

  it('el botón "Comprar ahora" está deshabilitado cuando stock === 0', () => {
    // TODO: verifica el atributo disabled del botón
  })

  it('emite el evento select con el producto al hacer clic en la tarjeta', async () => {
    // TODO: trigger('click') en el article y verifica emitted('select')[0][0] === mockProduct
  })

  it('emite el evento select al hacer clic en el botón de compra', async () => {
    // TODO: similar pero en el BaseButton
  })

  it('formatea el precio en COP correctamente', () => {
    // TODO: verifica que el precio aparezca con formato COP ($299.900)
  })

  it('usa la imagen de fallback cuando la imagen falla', async () => {
    // TODO: trigger el evento 'error' en el img y verifica que src cambió al placeholder
  })
})
