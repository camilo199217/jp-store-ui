// Composable para formatear precios en pesos colombianos (COP).
// Centralizo el formateo aquí para no repetir el Intl.NumberFormat en cada componente.

const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function usePriceFormat() {
  /**
   * Convierte centavos a pesos COP formateados.
   * Ejemplo: 299900 → "$2.999"
   */
  function formatPrice(cents: number): string {
    return formatter.format(cents / 100)
  }

  return { formatPrice }
}
