<template>
  <!-- Vista de resumen — paso 3 del flujo.
       Muestra la información del producto con el backdrop de confirmación.
       El PaymentBackdrop se abre automáticamente al montar esta vista. -->
  <div class="min-h-screen px-4 py-10 max-w-6xl mx-auto">
    <!-- Indicador de pasos -->
    <div class="mb-10 flex justify-center">
      <StepIndicator :current-step="2" />
    </div>

    <!-- Fondo — muestra el producto difuminado mientras el backdrop está abierto -->
    <div class="max-w-sm mx-auto opacity-50 pointer-events-none">
      <div v-if="selectedProduct" class="glass-card overflow-hidden">
        <div class="relative h-48 bg-white/5">
          <img
            :src="selectedProduct.imageUrl"
            :alt="selectedProduct.name"
            class="w-full h-full object-cover"
            @error="onImgError"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-ink-100">{{ selectedProduct.name }}</h3>
          <p class="text-white font-bold text-lg mt-1">{{ formatPrice(selectedProduct.priceInCents) }}</p>
        </div>
      </div>
    </div>

    <!-- Backdrop con el resumen completo -->
    <PaymentBackdrop
      v-model="backdropOpen"
      :product="selectedProduct"
      :customer="customer"
      :processing="processing"
      :quantity="selectedQuantity"
      @confirm="onConfirmPayment"
    />

    <!-- Toast de error si el pago falla -->
    <ToastNotification
      v-if="paymentError"
      :message="t(`errors.${paymentError}`)"
      type="error"
      @close="paymentError = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePriceFormat } from '@/composables/usePriceFormat.js'
import type { Product, Customer } from '@/types/index.js'
import StepIndicator from '@/components/atoms/StepIndicator.vue'
import PaymentBackdrop from '@/components/organisms/PaymentBackdrop.vue'
import ToastNotification from '@/components/molecules/ToastNotification.vue'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const { formatPrice } = usePriceFormat()

// El backdrop se abre automáticamente al entrar en esta vista
const backdropOpen = ref(true)
const paymentError = ref<string | null>(null)

const selectedProduct = computed<Product | null>(
  () => store.getters['products/selectedProduct']
)
const selectedQuantity = computed<number>(
  () => store.getters['products/selectedQuantity']
)
const customer = computed<Customer | null>(
  () => store.getters['checkout/customer']
)
const processing = computed<boolean>(
  () => store.getters['checkout/isProcessing']
)

// Si el backdrop se cierra sin pagar, vuelvo al formulario
watch(backdropOpen, (open) => {
  if (!open && !processing.value) {
    router.push({ name: 'checkout' })
  }
})

// Al montar, si el step ya es 'result' (refresh), redirijo al resultado
onMounted(() => {
  if (store.state.checkout.step === 'result') {
    router.push({ name: 'result' })
  }
})

// El usuario confirmó el pago en el backdrop
async function onConfirmPayment() {
  await store.dispatch('checkout/processPayment')

  const error = store.getters['checkout/error']
  if (error) {
    paymentError.value = error
    return
  }

  // El pago fue procesado (sea APPROVED, DECLINED o ERROR), navego al resultado
  router.push({ name: 'result' })
}

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
}
</script>
