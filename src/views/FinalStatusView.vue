<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
    <!-- Indicador de pasos -->
    <div class="absolute top-10 left-1/2 -translate-x-1/2">
      <StepIndicator :current-step="3" />
    </div>

    <!-- Partículas de fondo solo en APPROVED -->
    <div v-if="isApproved" class="pointer-events-none fixed inset-0 z-0">
      <div v-for="i in 8" :key="i"
        class="absolute rounded-full opacity-20 animate-float"
        :style="particleStyle(i)"
      />
    </div>

    <div class="w-full max-w-md z-10" :class="isApproved ? 'animate-bounce-in' : 'animate-fade-in'">

      <!-- ══ APPROVED ══════════════════════════════════════════════════════════ -->
      <template v-if="isApproved">
        <div class="glass-card p-8 text-center space-y-6 border border-success/30 shadow-[0_0_60px_rgba(34,197,94,0.15)]">

          <!-- Ícono grande con anillo pulsante -->
          <div class="flex justify-center">
            <div class="relative">
              <div class="absolute inset-0 rounded-full bg-success/20 animate-ping" />
              <div class="relative w-24 h-24 rounded-full bg-gradient-to-br from-success/30 to-success/10 border-2 border-success/60 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <svg class="w-12 h-12 text-success drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Título -->
          <div class="space-y-1">
            <h2 class="text-3xl font-extrabold text-success tracking-tight">¡Pago exitoso! 🎉</h2>
            <p class="text-ink-300 font-medium">Tu pedido está confirmado y en camino</p>
            <p class="text-ink-400 text-sm">Recibirás una confirmación en tu correo electrónico.</p>
          </div>

          <!-- Detalles -->
          <div v-if="transaction" class="bg-success/5 border border-success/20 rounded-xl p-4 space-y-2 text-left">
            <div class="flex justify-between text-sm">
              <span class="text-ink-400">N° de transacción</span>
              <span class="text-ink-200 font-mono text-xs truncate max-w-[55%]">{{ transaction.gatewayReference || transaction.id }}</span>
            </div>
            <div v-if="customer" class="flex justify-between text-sm">
              <span class="text-ink-400">Entrega a</span>
              <span class="text-ink-200 text-xs text-right max-w-[55%]">{{ customer.address }}, {{ customer.city }}</span>
            </div>
            <div class="flex justify-between text-sm pt-2 border-t border-success/20">
              <span class="text-ink-400">Total pagado</span>
              <span class="text-success font-bold text-base">{{ formatPrice(transaction.totalAmountInCents) }}</span>
            </div>
          </div>

          <!-- CTA principal -->
          <div class="space-y-3 pt-1">
            <BaseButton class="w-full text-base font-semibold" @click="goHome">
              🛍️ Seguir comprando
            </BaseButton>
            <p class="text-ink-500 text-xs">¡Hay más productos increíbles esperándote!</p>
          </div>
        </div>
      </template>

      <!-- ══ OTROS ESTADOS ═════════════════════════════════════════════════════ -->
      <template v-else>
        <div class="glass-card p-8 text-center space-y-6">

          <!-- Ícono -->
          <div class="flex justify-center">
            <!-- DECLINED -->
            <div v-if="isDeclined" class="w-20 h-20 rounded-full bg-warning/20 border-2 border-warning/50 flex items-center justify-center">
              <svg class="w-10 h-10 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <!-- PENDING -->
            <div v-else-if="isPending" class="w-20 h-20 rounded-full bg-blue-500/20 border-2 border-blue-500/50 flex items-center justify-center animate-pulse">
              <svg class="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <!-- ERROR -->
            <div v-else class="w-20 h-20 rounded-full bg-danger/20 border-2 border-danger/50 flex items-center justify-center">
              <svg class="w-10 h-10 text-danger-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
          </div>

          <!-- Título -->
          <div>
            <h2 :class="['text-2xl font-bold', isDeclined ? 'text-warning' : isPending ? 'text-blue-400' : 'text-danger-400']">
              {{ statusTexts.title }}
            </h2>
            <p class="text-ink-400 mt-2">{{ statusTexts.subtitle }}</p>
            <p class="text-ink-400 text-sm mt-1">{{ statusTexts.message }}</p>
          </div>

          <!-- Polling indicator -->
          <div v-if="isPending" class="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
            <svg class="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
              <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            <div class="flex-1 min-w-0">
              <p class="text-blue-300 text-xs font-medium">Verificando pago...</p>
              <p class="text-blue-400/70 text-xs">Próxima consulta en <span class="font-mono font-bold text-blue-300">{{ pollCountdown }}s</span></p>
            </div>
          </div>

          <!-- Detalles -->
          <div v-if="transaction" class="bg-white/5 rounded-xl p-4 space-y-2 text-left">
            <div class="flex justify-between text-sm">
              <span class="text-ink-400">{{ t('result.transactionId') }}</span>
              <span class="text-ink-200 font-mono text-xs truncate max-w-[60%]">{{ transaction.gatewayReference || transaction.id }}</span>
            </div>
            <div class="flex justify-between text-sm pt-2 border-t border-white/10">
              <span class="text-ink-400">Total</span>
              <span class="text-white font-bold">{{ formatPrice(transaction.totalAmountInCents) }}</span>
            </div>
          </div>

          <!-- Acciones -->
          <div class="space-y-3 pt-2">
            <BaseButton v-if="isPending" class="w-full" @click="goHome">
              {{ t('result.backToStore') }}
            </BaseButton>
            <template v-else>
              <BaseButton class="w-full" @click="tryAgain">
                {{ t('result.tryAgain') }}
              </BaseButton>
              <BaseButton variant="ghost" class="w-full" @click="goHome">
                {{ t('result.backToStore') }}
              </BaseButton>
            </template>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import confetti from 'canvas-confetti'
import { usePriceFormat } from '@/composables/usePriceFormat.js'
import { transactionsApi } from '@/services/api.js'
import type { Transaction, Customer } from '@/types/index.js'
import StepIndicator from '@/components/atoms/StepIndicator.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const { formatPrice } = usePriceFormat()

const transaction = computed<Transaction | null>(() => store.state.checkout.transaction)
const customer = computed<Customer | null>(() => store.getters['checkout/customer'])
const gatewayStatus = computed<string | null>(() => store.state.checkout.gatewayStatus)

const isApproved = computed(() => gatewayStatus.value === 'APPROVED' || transaction.value?.status === 'APPROVED')
const isDeclined = computed(() => gatewayStatus.value === 'DECLINED' || transaction.value?.status === 'DECLINED')
const isPending = computed(() => gatewayStatus.value === 'PENDING' || transaction.value?.status === 'PENDING')

// ── Confeti ───────────────────────────────────────────────────────────────────
function launchConfetti() {
  const duration = 3000
  const end = Date.now() + duration
  const colors = ['#22c55e', '#a855f7', '#3b82f6', '#f59e0b', '#ec4899']

  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors })

  const frame = () => {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors })
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

// Lanza el confeti cuando el estado cambia a APPROVED (polling)
watch(isApproved, (val) => { if (val) launchConfetti() })

// ── Partículas decorativas de fondo ──────────────────────────────────────────
function particleStyle(i: number) {
  const sizes = [60, 40, 80, 30, 50, 70, 45, 35]
  const colors = ['#22c55e', '#a855f7', '#3b82f6', '#f59e0b', '#ec4899', '#22c55e', '#a855f7', '#3b82f6']
  const s = sizes[(i - 1) % sizes.length]
  return {
    width: `${s}px`,
    height: `${s}px`,
    background: colors[(i - 1) % colors.length],
    top: `${10 + (i * 11) % 75}%`,
    left: `${5 + (i * 13) % 85}%`,
    animationDelay: `${(i * 0.4)}s`,
    animationDuration: `${4 + (i % 3)}s`,
  }
}

// ── Polling ───────────────────────────────────────────────────────────────────
const POLL_INTERVAL = 5
const pollCountdown = ref(POLL_INTERVAL)
let pollTimer: ReturnType<typeof setInterval> | null = null
let countdownTimer: ReturnType<typeof setInterval> | null = null

async function doPoll() {
  const txId = transaction.value?.id
  if (!txId) return
  try {
    const tx = await transactionsApi.getById(txId)
    if (tx.status !== 'PENDING') {
      store.commit('checkout/SET_TRANSACTION', tx)
      store.commit('checkout/SET_GATEWAY_STATUS', tx.status)
      stopPolling()
    } else {
      pollCountdown.value = POLL_INTERVAL
    }
  } catch {
    pollCountdown.value = POLL_INTERVAL
  }
}

function startPolling() {
  if (pollTimer) return
  pollCountdown.value = POLL_INTERVAL
  countdownTimer = setInterval(() => { if (pollCountdown.value > 0) pollCountdown.value-- }, 1000)
  pollTimer = setInterval(doPoll, POLL_INTERVAL * 1000)
}

function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null }
}

onMounted(() => {
  if (isApproved.value) {
    launchConfetti()
  } else if (isPending.value) {
    startPolling()
  }
})

onUnmounted(() => stopPolling())

// Textos para estados no-APPROVED
const statusTexts = computed(() => {
  if (isDeclined.value) return { title: t('result.declined.title'), subtitle: t('result.declined.subtitle'), message: t('result.declined.message') }
  if (isPending.value) return { title: t('result.pending.title'), subtitle: t('result.pending.subtitle'), message: t('result.pending.message') }
  return { title: t('result.error.title'), subtitle: t('result.error.subtitle'), message: t('result.error.message') }
})

function goHome() {
  router.push({ name: 'products' }).then(() => {
    store.dispatch('checkout/reset')
    store.commit('products/CLEAR_SELECTED')
  })
}

function tryAgain() {
  store.dispatch('checkout/reset')
  router.push({ name: 'checkout' })
}
</script>

<style scoped>
@keyframes bounce-in {
  0% { transform: scale(0.8); opacity: 0; }
  60% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); }
}
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}
.animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.animate-float { animation: float 4s ease-in-out infinite; }
</style>
