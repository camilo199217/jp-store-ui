<template>
  <!-- Vista de checkout — paso 2 del flujo.
       Muestra el formulario de tarjeta + datos de entrega.
       El backdrop de resumen (PaymentBackdrop) se activa al enviar el formulario. -->
  <div class="min-h-screen px-4 py-10 max-w-6xl mx-auto">
    <!-- Indicador de pasos -->
    <div class="mb-10 flex justify-center">
      <StepIndicator :current-step="1" />
    </div>

    <!-- Header del paso -->
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-white">{{ t('checkout.title') }}</h2>
      <p class="text-ink-400 mt-1">{{ t('checkout.subtitle') }}</p>
    </div>

    <!-- Mini card del producto seleccionado con selector de cantidad -->
    <div v-if="selectedProduct" class="max-w-sm mx-auto mb-8">
      <div class="glass-card p-4 flex items-center gap-4">
        <img
          :src="selectedProduct.imageUrl"
          :alt="selectedProduct.name"
          class="w-14 h-14 rounded-xl object-cover shrink-0"
          @error="onImgError"
        />
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-ink-100 truncate text-sm">{{ selectedProduct.name }}</p>
          <p class="text-primary-400 font-bold">{{ formatPrice(selectedProduct.priceInCents) }}</p>
        </div>
        <!-- Stepper de cantidad -->
        <div class="flex items-center gap-2 shrink-0">
          <button
            class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-40"
            :disabled="quantity <= 1"
            @click="decrement"
          >
            <span class="text-white font-bold text-sm leading-none select-none">−</span>
          </button>
          <span class="text-white font-bold w-5 text-center text-sm tabular-nums">{{ quantity }}</span>
          <button
            class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-40"
            :disabled="quantity >= selectedProduct.stock"
            @click="increment"
          >
            <span class="text-white font-bold text-sm leading-none select-none">+</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Formulario de checkout -->
    <CheckoutForm ref="checkoutFormRef" @back="goBack" />

    <!-- Drawer de datos de prueba — solo en DEV (fixed positioning, no afecta layout) -->
    <DevDrawer
      @fill-card="onFillCard"
      @fill-user="onFillUser"
      @fill-all="onFillAll"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePriceFormat } from '@/composables/usePriceFormat.js'
import type { Product } from '@/types/index.js'
import StepIndicator from '@/components/atoms/StepIndicator.vue'
import CheckoutForm from '@/components/organisms/CheckoutForm.vue'
import DevDrawer from '@/components/organisms/DevDrawer.vue'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const { formatPrice } = usePriceFormat()

const checkoutFormRef = ref<InstanceType<typeof CheckoutForm> | null>(null)

const selectedProduct = computed<Product | null>(
  () => store.getters['products/selectedProduct']
)

const quantity = computed<number>(() => store.getters['products/selectedQuantity'])

function increment() {
  const max = selectedProduct.value?.stock ?? 1
  if (quantity.value < max) {
    store.dispatch('products/setQuantity', quantity.value + 1)
  }
}

function decrement() {
  if (quantity.value > 1) {
    store.dispatch('products/setQuantity', quantity.value - 1)
  }
}

// ── Dev drawer handlers ───────────────────────────────────────────────────────

function onFillCard(card: { number: string; expiry: string; cvv: string; holder: string }) {
  checkoutFormRef.value?.fill({
    cardNumber: card.number,
    cardName: card.holder,
    cardExpiry: card.expiry,
    cardCvv: card.cvv,
  })
}

function onFillUser(user: { fullName: string; email: string; phone: string; address: string; city: string }) {
  checkoutFormRef.value?.fill({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    city: user.city,
  })
}

function onFillAll(combo: { card: Parameters<typeof onFillCard>[0]; user: Parameters<typeof onFillUser>[0] }) {
  checkoutFormRef.value?.fill({
    cardNumber: combo.card.number,
    cardName: combo.card.holder,
    cardExpiry: combo.card.expiry,
    cardCvv: combo.card.cvv,
    fullName: combo.user.fullName,
    email: combo.user.email,
    phone: combo.user.phone,
    address: combo.user.address,
    city: combo.user.city,
  })
}

function goBack() {
  router.push({ name: 'products' })
}

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
}
</script>
