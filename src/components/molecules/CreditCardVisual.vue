<template>
  <!-- Tarjeta de crédito visual con efecto flip 3D al enfocar el CVV.
       El frente muestra número, nombre y vencimiento. El reverso el CVV. -->
  <div class="card-scene w-full max-w-[340px] mx-auto h-[200px]">
    <div class="card-3d w-full h-full relative" :class="{ 'is-flipped': showBack }">

      <!-- ── Frente de la tarjeta ──────────────────────────────────────── -->
      <div class="card-face absolute inset-0">
        <div class="w-full h-full rounded-2xl p-6 flex flex-col justify-between overflow-hidden"
             :style="cardGradient">
          <!-- Efecto holográfico de fondo -->
          <div class="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.4)_0%,_transparent_60%)]" />

          <!-- Fila superior: chip + logo de marca -->
          <div class="flex items-center justify-between relative z-10">
            <!-- Chip EMV simulado -->
            <div class="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-90 grid grid-cols-3 grid-rows-3 gap-px p-1">
              <div v-for="i in 9" :key="i" class="bg-yellow-600/30 rounded-sm" />
            </div>
            <!-- Logo de marca detectado -->
            <transition name="fade-in" mode="out-in">
              <VisaLogo v-if="brand === 'visa'" key="visa" class="h-8 opacity-90" />
              <MastercardLogo v-else-if="brand === 'mastercard'" key="mc" class="h-8 opacity-90" />
              <div v-else key="unknown" class="h-8 w-16 rounded-md bg-white/10 border border-white/20" />
            </transition>
          </div>

          <!-- Número de tarjeta -->
          <div class="font-mono text-xl tracking-[0.25em] text-white relative z-10 mt-2">
            {{ formattedNumber }}
          </div>

          <!-- Fila inferior: nombre + vencimiento -->
          <div class="flex items-end justify-between relative z-10">
            <div>
              <p class="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">Titular</p>
              <p class="text-white text-sm font-medium uppercase tracking-wide truncate max-w-[160px]">
                {{ cardName || 'NOMBRE APELLIDO' }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">Vence</p>
              <p class="text-white text-sm font-mono">{{ cardExpiry || 'MM/AA' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Reverso de la tarjeta (CVV) ──────────────────────────────── -->
      <div class="card-face card-face-back absolute inset-0">
        <div class="w-full h-full rounded-2xl overflow-hidden" :style="cardGradient">
          <!-- Banda magnética -->
          <div class="w-full h-10 bg-black/60 mt-6" />
          <!-- Panel de CVV -->
          <div class="mx-6 mt-4">
            <div class="w-full h-10 bg-white/90 rounded flex items-center justify-end px-4">
              <span class="font-mono text-gray-800 text-lg tracking-[0.3em]">
                {{ cvvDisplay }}
              </span>
            </div>
            <p class="text-white/50 text-[10px] mt-1.5 text-right">CVV</p>
          </div>
          <!-- Logo de marca en el reverso -->
          <div class="flex justify-end px-6 mt-4">
            <VisaLogo v-if="brand === 'visa'" class="h-6 opacity-60" />
            <MastercardLogo v-else-if="brand === 'mastercard'" class="h-6 opacity-60" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CardBrand } from '@/types/index.js'
import VisaLogo from '@/components/atoms/VisaLogo.vue'
import MastercardLogo from '@/components/atoms/MastercardLogo.vue'

const props = defineProps<{
  cardNumber: string
  cardName: string
  cardExpiry: string
  cardCvv: string
  brand: CardBrand
  showBack: boolean
}>()

// Gradiente de la tarjeta según la marca detectada
const cardGradient = computed(() => {
  const gradients = {
    visa: 'background: linear-gradient(135deg, #1a1f71 0%, #2563eb 100%)',
    mastercard: 'background: linear-gradient(135deg, #1a1a1a 0%, #eb5757 100%)',
    unknown: 'background: linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)',
  }
  return gradients[props.brand]
})

// Número formateado con grupos de 4 — rellena con • si aún no está completo
const formattedNumber = computed(() => {
  const raw = props.cardNumber.replace(/\D/g, '').padEnd(16, '•')
  return raw.match(/.{1,4}/g)?.join(' ') ?? '•••• •••• •••• ••••'
})

// Ocultar el CVV real con puntos por seguridad
const cvvDisplay = computed(() => {
  if (!props.cardCvv) return '•••'
  return '•'.repeat(props.cardCvv.length)
})
</script>
