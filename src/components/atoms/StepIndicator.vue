<template>
  <!-- Indicador de progreso de 4 pasos — muestra en qué punto del checkout está el usuario -->
  <div class="flex items-center w-full max-w-xs mx-auto">
    <template v-for="(step, i) in steps" :key="step.key">
      <!-- Círculo del paso -->
      <div class="flex flex-col items-center gap-1">
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
            isCompleted(i)
              ? 'bg-success text-white shadow-glow-success'
              : isCurrent(i)
                ? 'bg-primary text-white shadow-glow animate-pulse-glow'
                : 'bg-white/10 text-ink-400',
          ]"
        >
          <!-- Check si ya pasó, número si es actual o futuro -->
          <svg v-if="isCompleted(i)" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span v-else>{{ i + 1 }}</span>
        </div>
        <span
          :class="[
            'text-[10px] font-medium hidden sm:block whitespace-nowrap transition-colors duration-300',
            isCurrent(i) ? 'text-primary-400' : isCompleted(i) ? 'text-success' : 'text-ink-400',
          ]"
        >
          {{ step.label }}
        </span>
      </div>

      <!-- Línea conectora entre pasos -->
      <div
        v-if="i < steps.length - 1"
        class="flex-1 h-px mx-2 transition-all duration-500"
        :class="isCompleted(i) ? 'bg-success/50' : 'bg-white/10'"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{ currentStep: number }>()

const steps = [
  { key: 'products', label: t('steps.products') },
  { key: 'checkout', label: t('steps.checkout') },
  { key: 'summary',  label: t('steps.summary') },
  { key: 'result',   label: t('steps.result') },
]

const isCompleted = (i: number) => i < props.currentStep
const isCurrent   = (i: number) => i === props.currentStep
</script>
