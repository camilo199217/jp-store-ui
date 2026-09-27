<template>
  <!-- Badge de estado — stock, disponibilidad, resultado del pago -->
  <span :class="['status-badge', variantClasses]">
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full" :class="dotColor" />
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  dot?: boolean
}>(), {
  variant: 'neutral',
  dot: false,
})

const variantClasses = {
  success: 'bg-success/80 text-white border border-success/40',
  warning: 'bg-warning/10 text-warning-400 border border-warning/20',
  danger:  'bg-danger/10 text-danger-400 border border-danger/20',
  info:    'bg-primary/10 text-primary-400 border border-primary/20',
  neutral: 'bg-white/5 text-ink-400 border border-white/10',
}[props.variant]

const dotColor = {
  success: 'bg-success',
  warning: 'bg-warning-400',
  danger:  'bg-danger-400',
  info:    'bg-primary-400',
  neutral: 'bg-ink-400',
}[props.variant]
</script>
