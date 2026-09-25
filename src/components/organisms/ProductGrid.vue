<template>
  <!-- Grid de productos con paginación y estados de carga/error. -->
  <section>
    <!-- Header de la tienda -->
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-white tracking-tight">
        {{ t('products.title') }}
      </h1>
      <p class="mt-2 text-ink-400 text-lg">{{ t('products.subtitle') }}</p>
    </div>

    <!-- Estado de error global (solo si no hay productos) -->
    <div v-if="error && items.length === 0" class="text-center py-20">
      <p class="text-danger-400 mb-4">{{ t(`errors.${error}`) }}</p>
      <BaseButton @click="retry">{{ t('common.retry') }}</BaseButton>
    </div>

    <!-- Grid de tarjetas -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Skeletons durante la carga inicial -->
      <template v-if="loading && items.length === 0">
        <SkeletonCard v-for="n in 9" :key="`sk-${n}`" />
      </template>

      <!-- Productos cargados -->
      <ProductCard
        v-for="product in items"
        :key="product.id"
        :product="product"
        @select="onSelect"
      />
    </div>

    <!-- Paginación — Anterior / Siguiente -->
    <div v-if="!loading && totalPages > 1" class="flex items-center justify-center gap-4 mt-10">
      <BaseButton
        variant="ghost"
        size="sm"
        :disabled="currentPage <= 1"
        @click="changePage(currentPage - 1)"
      >
        ← Anterior
      </BaseButton>

      <span class="text-ink-400 text-sm">
        {{ t('products.page', { current: currentPage, total: totalPages }) }}
      </span>

      <BaseButton
        variant="ghost"
        size="sm"
        :disabled="currentPage >= totalPages"
        @click="changePage(currentPage + 1)"
      >
        Siguiente →
      </BaseButton>
    </div>

    <!-- Spinner de carga al cambiar de página -->
    <div v-if="loading && items.length > 0" class="flex justify-center py-8">
      <div class="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Product } from '@/types/index.js'
import ProductCard from '@/components/molecules/ProductCard.vue'
import SkeletonCard from '@/components/atoms/SkeletonCard.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const { t } = useI18n()
const store = useStore()
const router = useRouter()

// Estado reactivo derivado del módulo products del store
const items = computed(() => store.state.products.items as Product[])
const loading = computed(() => store.state.products.loading as boolean)
const error = computed(() => store.state.products.error as string | null)
const currentPage = computed(() => store.state.products.currentPage as number)
const totalPages = computed(() => store.state.products.totalPages as number)

// Cargo productos al montar si el store aún no tiene datos
onMounted(() => {
  if (items.value.length === 0) {
    store.dispatch('products/fetchProducts', 1)
  }
})

function retry() {
  store.dispatch('products/fetchProducts', 1)
}

function changePage(page: number) {
  store.dispatch('products/fetchProducts', page)
  // Scroll al top para que el usuario vea los nuevos productos
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// El usuario hizo clic en "Comprar ahora" en una tarjeta de producto
function onSelect(product: Product) {
  store.dispatch('products/selectProduct', product)
  // Limpio el checkout anterior antes de iniciar uno nuevo
  store.dispatch('checkout/reset')
  router.push({ name: 'checkout' })
}
</script>
