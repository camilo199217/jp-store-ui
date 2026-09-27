<template>
  <!-- Vista principal — muestra la tienda de productos.
       Es el punto de entrada del flujo de checkout. -->
  <div class="min-h-screen px-4 py-10 max-w-7xl mx-auto">
    <!-- Indicador de pasos en la parte superior -->
    <div class="mb-10 flex justify-center">
      <StepIndicator :current-step="0" />
    </div>

    <!-- Grid de productos -->
    <ProductGrid />
  </div>
</template>

<script setup lang="ts">
import StepIndicator from '@/components/atoms/StepIndicator.vue'
import ProductGrid from '@/components/organisms/ProductGrid.vue'
</script>
