<template>
  <!-- Botón base reutilizable — soporta 3 variantes y estado de carga -->
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95 select-none',
      sizeClasses,
      variantClasses,
      { 'opacity-50 cursor-not-allowed': disabled || loading },
    ]"
    v-bind="$attrs"
  >
    <!-- Spinner de carga -->
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </span>

    <!-- Contenido normal (oculto mientras carga) -->
    <span :class="{ 'opacity-0': loading }" class="flex items-center gap-2">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
// Acepto herencia de atributos para poder pasar @click, aria-*, etc. desde el padre
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
})

// Clases de tamaño separadas de las de variante para mantener legibilidad
const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}[props.size]

const variantClasses = {
  primary: 'bg-primary hover:bg-primary-700 text-white shadow-glow hover:shadow-glow',
  ghost: 'border border-white/20 text-ink-200 hover:bg-white/5',
  danger: 'bg-danger/20 border border-danger/40 text-danger-400 hover:bg-danger/30',
}[props.variant]
</script>
