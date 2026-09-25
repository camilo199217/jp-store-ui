<template>
  <!-- Vista 404 — se muestra sin redirigir, la URL queda tal como la escribió el usuario.
       Diseñada para ser un poco divertida pero manteniendo el estilo glassmorphism. -->
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center space-y-6 animate-fade-in">

      <!-- Número 404 grande con efecto de brillo -->
      <div class="relative inline-block">
        <span class="text-[10rem] font-black text-white/5 select-none leading-none">404</span>
        <span class="absolute inset-0 flex items-center justify-center text-5xl font-black text-white">
          404
        </span>
      </div>

      <!-- Ícono -->
      <div class="flex justify-center">
        <div class="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <svg class="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>

      <!-- Mensaje -->
      <div>
        <h1 class="text-2xl font-bold text-white">Página no encontrada</h1>
        <p class="text-ink-400 mt-2 max-w-sm mx-auto">
          La URL
          <code class="bg-white/10 text-primary-300 px-1.5 py-0.5 rounded text-sm font-mono">
            {{ currentPath }}
          </code>
          no existe en esta tienda.
        </p>
      </div>

      <!-- Acción -->
      <BaseButton @click="router.push({ name: 'products' })">
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        Ir a la tienda
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/atoms/BaseButton.vue'

const route = useRoute()
const router = useRouter()

// Muestro la URL que intentó visitar el usuario para que sepa qué escribió mal
const currentPath = computed(() => route.path)
</script>
