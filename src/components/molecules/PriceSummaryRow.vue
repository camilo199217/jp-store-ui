<template>
  <!-- Fila del resumen de precio — reutilizable en el Backdrop y en el estado final -->
  <div :class="['flex items-center justify-between py-2', isTotal ? 'border-t border-white/10 pt-3 mt-1' : '']">
    <span :class="isTotal ? 'font-semibold text-ink-100' : 'text-ink-400 text-sm'">
      {{ label }}
    </span>
    <span
      :class="[
        'font-mono',
        isTotal ? 'text-lg font-bold text-white' : 'text-sm text-ink-200',
      ]"
    >
      {{ formatPrice(amountInCents) }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  amountInCents: number
  isTotal?: boolean
}>(), { isTotal: false })

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(cents / 100)
}
</script>
