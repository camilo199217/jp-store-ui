<template>
  <!-- Input base con label flotante y mensaje de error integrado -->
  <div class="relative">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger-400 ml-0.5">*</span>
    </label>

    <div class="relative">
      <!-- Ícono izquierdo opcional -->
      <span v-if="$slots.prefix" class="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
        <slot name="prefix" />
      </span>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :inputmode="(inputmode as any)"
        :autocomplete="autocomplete"
        :class="[
          'form-input',
          { 'pl-10': $slots.prefix, 'pr-10': $slots.suffix },
          { 'border-danger/60 focus:border-danger focus:ring-danger/30': hasError },
          { 'border-success/60 focus:border-success focus:ring-success/30': isValid && modelValue },
        ]"
        @input="onInput"
        @blur="emit('blur')"
        @focus="emit('focus')"
        v-bind="$attrs"
      />

      <!-- Ícono derecho opcional (ej. logos de tarjeta) -->
      <span v-if="$slots.suffix" class="absolute right-3 top-1/2 -translate-y-1/2">
        <slot name="suffix" />
      </span>
    </div>

    <!-- Mensaje de error con animación -->
    <transition name="slide-down">
      <p v-if="error" class="mt-1.5 text-xs text-danger-400 flex items-center gap-1">
        <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        {{ error }}
      </p>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  type?: string
  error?: string
  disabled?: boolean
  required?: boolean
  maxlength?: number
  inputmode?: string
  autocomplete?: string
  isValid?: boolean
}>(), {
  type: 'text',
  isValid: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
  focus: []
}>()

// ID único para el label — evita colisiones si hay varios inputs iguales en la página
const inputId = computed(() => `input-${Math.random().toString(36).slice(2, 7)}`)
const hasError = computed(() => !!props.error)

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>
