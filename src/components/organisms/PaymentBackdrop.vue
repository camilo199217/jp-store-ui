<template>
  <!-- Backdrop de Material Design para el resumen de pago.
       Se desliza desde abajo sobre la pantalla anterior, dando la sensación
       de que el contenido está "encima" sin cambiar de ruta visualmente.
       La animación slide-up viene del CSS en main.css. -->
  <teleport to="body">
    <transition name="backdrop-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-40 flex items-end justify-center"
        @click.self="onOverlayClick"
      >
        <!-- Capa de oscurecimiento del fondo -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <!-- Panel deslizante -->
        <transition name="backdrop-slide">
          <div
            v-if="modelValue"
            class="relative w-full max-w-lg bg-surface-900 border border-white/10 rounded-t-3xl shadow-glass-lg z-10 max-h-[90vh] flex flex-col"
          >
            <!-- Handle / Indicador de arrastre -->
            <div class="flex justify-center pt-3 pb-1">
              <div class="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <!-- Header -->
            <div class="px-6 py-4 border-b border-white/10">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-white">
                  {{ t('summary.title') }}
                </h2>
                <button
                  class="text-ink-400 hover:text-ink-100 transition-colors p-1"
                  :aria-label="t('common.close')"
                  @click="emit('update:modelValue', false)"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Estado de procesamiento — reemplaza el contenido mientras se paga -->
            <div v-if="processing" class="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-6">
              <!-- Spinner con candado -->
              <div class="relative w-20 h-20">
                <svg class="w-20 h-20 animate-spin text-primary-500" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
                  <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg class="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
              </div>

              <!-- Mensaje rotativo + puntos animados -->
              <div class="text-center space-y-1">
                <p class="text-white font-semibold text-lg">
                  {{ processingStep }}<span class="inline-block w-6 text-left">{{ dots }}</span>
                </p>
                <p class="text-ink-400 text-sm">{{ t('summary.processingHint') }}</p>
              </div>

              <!-- Barra de progreso animada -->
              <div class="w-full max-w-xs">
                <div class="h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-primary-500 transition-all duration-700 ease-in-out"
                    :style="{ width: `${progressWidth}%` }"
                  />
                </div>
              </div>
            </div>

            <!-- Contenido scrolleable -->
            <div v-else class="flex-1 overflow-y-auto px-6 py-4 space-y-2">

              <!-- Info del producto -->
              <div class="flex items-center gap-4 mb-4 p-3 glass-card">
                <img
                  :src="product?.imageUrl"
                  :alt="product?.name"
                  class="w-16 h-16 object-cover rounded-xl"
                  @error="onImgError"
                />
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-ink-100 truncate">{{ product?.name }}</p>
                  <p class="text-xs text-ink-400">{{ product?.description?.substring(0, 60) }}...</p>
                </div>
              </div>

              <!-- Desglose de precios -->
              <PriceSummaryRow
                :label="quantity > 1 ? `${t('summary.product')} × ${quantity}` : t('summary.product')"
                :amount-in-cents="(product?.priceInCents ?? 0) * quantity"
              />
              <PriceSummaryRow
                :label="t('summary.baseFee')"
                :amount-in-cents="BASE_FEE_CENTS"
              />
              <PriceSummaryRow
                :label="t('summary.deliveryFee')"
                :amount-in-cents="DELIVERY_FEE_CENTS"
              />
              <PriceSummaryRow
                :label="t('summary.total')"
                :amount-in-cents="totalAmountInCents"
                :is-total="true"
              />

              <!-- Cuotas -->
              <div class="pt-3 border-t border-white/10">
                <p class="text-xs text-ink-400">
                  {{ t('summary.installments') }}:
                  <span class="text-ink-200 font-medium">{{ t('summary.oneInstallment') }}</span>
                </p>
              </div>

              <!-- Datos del cliente (confirmar entrega) -->
              <div class="pt-2 text-xs text-ink-400 space-y-1">
                <p class="font-medium text-ink-300">Entrega a:</p>
                <p>{{ customer?.name }}</p>
                <p>{{ customer?.address }}, {{ customer?.city }}</p>
                <p>{{ customer?.email }}</p>
              </div>
            </div>

            <!-- Footer con acciones — oculto mientras procesa -->
            <div v-if="!processing" class="px-6 py-5 border-t border-white/10 space-y-3">
              <!-- Botón de pago -->
              <BaseButton
                class="w-full"
                :loading="processing"
                :disabled="processing"
                @click="emit('confirm')"
              >
                <template v-if="!processing">
                  <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  {{ t('summary.pay') }}
                </template>
                <template v-else>
                  {{ t('summary.processing') }}
                </template>
              </BaseButton>

              <!-- Cancelar -->
              <BaseButton
                variant="ghost"
                class="w-full"
                :disabled="processing"
                @click="emit('update:modelValue', false)"
              >
                {{ t('summary.cancel') }}
              </BaseButton>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Product, Customer } from '@/types/index.js'
import PriceSummaryRow from '@/components/molecules/PriceSummaryRow.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean
  product: Product | null
  customer: Customer | null
  processing: boolean
  quantity?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

// Tarifas del negocio — leídas del .env para coincidir con los valores del backend
const BASE_FEE_CENTS = Number(import.meta.env.VITE_BASE_FEE ?? 1500000)
const DELIVERY_FEE_CENTS = Number(import.meta.env.VITE_DELIVERY_FEE ?? 890000)

// ── Animación de procesamiento ────────────────────────────────────────────────
const STEPS = [
  'Verificando tarjeta',
  'Conectando con el gateway',
  'Procesando pago',
  'Confirmando transacción',
]
const stepIndex = ref(0)
const dots = ref('')
const progressWidth = ref(0)
let stepTimer: ReturnType<typeof setInterval> | null = null
let dotsTimer: ReturnType<typeof setInterval> | null = null

const processingStep = computed(() => STEPS[stepIndex.value])

watch(() => props.processing, (active) => {
  if (active) {
    stepIndex.value = 0
    progressWidth.value = 15
    dots.value = ''

    // Avanza el mensaje y la barra cada 2s
    stepTimer = setInterval(() => {
      if (stepIndex.value < STEPS.length - 1) {
        stepIndex.value++
        progressWidth.value = Math.min(90, progressWidth.value + 22)
      }
    }, 2000)

    // Anima los puntos suspensivos
    let dotCount = 0
    dotsTimer = setInterval(() => {
      dotCount = (dotCount + 1) % 4
      dots.value = '.'.repeat(dotCount)
    }, 400)
  } else {
    if (stepTimer) clearInterval(stepTimer)
    if (dotsTimer) clearInterval(dotsTimer)
    stepIndex.value = 0
    progressWidth.value = 0
    dots.value = ''
  }
})

onUnmounted(() => {
  if (stepTimer) clearInterval(stepTimer)
  if (dotsTimer) clearInterval(dotsTimer)
})

// Total = precio del producto × cantidad + tarifas
const quantity = computed(() => props.quantity ?? 1)
const totalAmountInCents = computed(
  () => (props.product?.priceInCents ?? 0) * quantity.value + BASE_FEE_CENTS + DELIVERY_FEE_CENTS
)

// Cerrar el backdrop si el usuario hace clic fuera del panel
// solo cuando no está procesando para no perder el estado
function onOverlayClick() {
  if (!props.processing) {
    emit('update:modelValue', false)
  }
}

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
}
</script>

<style scoped>
/* Animación del overlay de fondo */
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.3s ease;
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

/* Animación del panel deslizante desde abajo */
.backdrop-slide-enter-active,
.backdrop-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}
.backdrop-slide-enter-from,
.backdrop-slide-leave-to {
  transform: translateY(100%);
}
</style>
