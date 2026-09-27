<template>
  <!-- Tarjeta de producto con imagen, precio y botón de compra.
       El efecto hover levanta la card con sombra para dar sensación de profundidad. -->
  <article
    class="glass-card overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg hover:border-primary/30 animate-fade-in"
    @click="emit('select', product)"
  >
    <!-- Imagen del producto con overlay en hover -->
    <div class="relative overflow-hidden h-48 bg-white/5">
      <img
        :src="product.imageUrl"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        @error="onImgError"
      />
      <!-- Overlay con gradiente para suavizar la transición imagen → texto -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <!-- Badge de stock sobre la imagen -->
      <div class="absolute top-3 right-3">
        <BaseBadge v-if="product.stock > 0" variant="success" dot>
          {{ t('products.inStock', { n: product.stock }) }}
        </BaseBadge>
        <BaseBadge v-else variant="danger">
          {{ t('products.outOfStock') }}
        </BaseBadge>
      </div>
    </div>

    <!-- Contenido -->
    <div class="p-4 space-y-3">
      <h3 class="font-semibold text-ink-100 text-base leading-snug line-clamp-1 group-hover:text-primary-400 transition-colors">
        {{ product.name }}
      </h3>

      <p class="text-ink-400 text-xs leading-relaxed line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Precio + acción -->
      <div class="flex items-center justify-between pt-1">
        <div>
          <p class="text-[10px] text-ink-400 uppercase tracking-wider">Precio</p>
          <p class="text-lg font-bold text-white">
            {{ formatPrice(product.priceInCents) }}
          </p>
        </div>

        <BaseButton
          :disabled="product.stock === 0"
          size="sm"
          @click.stop="emit('select', product)"
        >
          {{ t('products.buy') }}
        </BaseButton>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Product } from '@/types/index.js'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseBadge from '@/components/atoms/BaseBadge.vue'

const { t } = useI18n()

defineProps<{ product: Product }>()
const emit = defineEmits<{ select: [product: Product] }>()

// Formatea centavos a pesos COP con separador de miles
function formatPrice(cents: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

// Si la imagen falla, muestro un placeholder neutro
function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
}
</script>
