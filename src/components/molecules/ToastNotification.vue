<template>
  <!-- Toast de error/éxito que aparece desde abajo — se auto-cierra en 5s -->
  <teleport to="body">
    <transition name="slide-up">
      <div
        v-if="visible"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm"
      >
        <div
          :class="[
            'glass-card px-4 py-3 flex items-start gap-3 shadow-glass-lg border',
            typeClasses,
          ]"
        >
          <!-- Ícono según tipo -->
          <div :class="['w-5 h-5 shrink-0 mt-0.5', iconColor]">
            <svg v-if="type === 'error'" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <svg v-else fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>

          <p class="text-sm text-ink-100 flex-1">{{ message }}</p>

          <button class="text-ink-400 hover:text-ink-100 transition-colors shrink-0" @click="close">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  message: string
  type?: 'error' | 'success'
  duration?: number
}>(), { type: 'error', duration: 5000 })

const emit = defineEmits<{ close: [] }>()

const visible = ref(true)
let timer: ReturnType<typeof setTimeout>

const typeClasses = props.type === 'error'
  ? 'border-danger/30 bg-danger/10'
  : 'border-success/30 bg-success/10'

const iconColor = props.type === 'error' ? 'text-danger-400' : 'text-success'

function close() {
  visible.value = false
  emit('close')
}

// Auto-cierre después del tiempo configurado
timer = setTimeout(close, props.duration)
onUnmounted(() => clearTimeout(timer))
</script>
