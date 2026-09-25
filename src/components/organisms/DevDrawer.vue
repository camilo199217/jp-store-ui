<template>
  <!-- Solo se monta en modo desarrollo — invisible en producción -->
  <div v-if="isDev" class="fixed bottom-6 right-6 z-50">

    <!-- Botón toggle — ámbar para que destaque visualmente como herramienta dev -->
    <button
      class="w-11 h-11 rounded-full bg-warning/90 hover:bg-warning text-ink-800 shadow-glass flex items-center justify-center transition-all hover:scale-110 active:scale-95 font-bold text-sm"
      title="Datos de prueba (solo DEV)"
      @click="open = !open"
    >
      <!-- Icono "beaker / lab" en SVG -->
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M9.75 3v7.5L6.22 17.03A2.25 2.25 0 008.18 21h7.64a2.25 2.25 0 001.96-3.97L14.25 10.5V3M9.75 3h4.5M9.75 3H8.25M14.25 3h1.5"/>
      </svg>
    </button>

    <!-- Panel drawer (sale desde abajo-derecha) -->
    <transition name="dev-slide">
      <div
        v-if="open"
        class="absolute bottom-14 right-0 w-80 bg-[#12121f] border border-warning/30 rounded-2xl shadow-glass-lg overflow-hidden"
      >
        <!-- Header con badge DEV -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-warning/10">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold bg-warning text-ink-800 px-1.5 py-0.5 rounded uppercase tracking-widest">DEV</span>
            <span class="text-xs font-semibold text-ink-200">Datos de prueba</span>
          </div>
          <button
            class="text-ink-400 hover:text-ink-100 transition-colors"
            @click="open = false"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-white/10">
          <button
            v-for="t in TABS"
            :key="t.id"
            class="flex-1 py-2.5 text-xs font-semibold transition-colors"
            :class="tab === t.id
              ? 'text-warning border-b-2 border-warning bg-warning/5'
              : 'text-ink-400 hover:text-ink-200'"
            @click="tab = t.id"
          >
            {{ t.label }}
          </button>
        </div>

        <!-- Contenido scrolleable -->
        <div class="max-h-[420px] overflow-y-auto p-3 space-y-2">

          <!-- ── Tab: Tarjetas ────────────────────────────────────────── -->
          <template v-if="tab === 'cards'">
            <div
              v-for="card in TEST_CARDS"
              :key="card.number"
              class="rounded-xl border border-white/8 bg-white/3 p-3 space-y-2"
            >
              <!-- Info de la tarjeta -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <!-- Brand icon -->
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
                    :class="card.brand === 'visa'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-orange-500/20 text-orange-300'"
                  >{{ card.brand }}</span>
                  <!-- Resultado esperado -->
                  <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase"
                    :class="card.result === 'APPROVED'
                      ? 'bg-success/20 text-success-400'
                      : card.result === 'DECLINED'
                        ? 'bg-danger/20 text-danger-400'
                        : 'bg-warning/20 text-warning-400'"
                  >{{ card.result }}</span>
                </div>
                <button
                  class="text-[11px] font-semibold text-warning hover:text-white px-2 py-0.5 rounded-lg border border-warning/30 hover:border-warning/60 transition-colors"
                  @click="fillCard(card)"
                >
                  Usar
                </button>
              </div>

              <!-- Datos de la tarjeta -->
              <div class="font-mono text-xs text-ink-300 space-y-0.5">
                <p class="tracking-widest">{{ formatCardNumber(card.number) }}</p>
                <div class="flex gap-4 text-ink-400">
                  <span>Exp: {{ card.expiry }}</span>
                  <span>CVV: {{ card.cvv }}</span>
                </div>
                <p class="text-ink-400">{{ card.holder }}</p>
              </div>

              <p v-if="card.note" class="text-[10px] text-ink-400 italic">{{ card.note }}</p>
            </div>
          </template>

          <!-- ── Tab: Usuarios ───────────────────────────────────────── -->
          <template v-else-if="tab === 'users'">
            <div
              v-for="user in TEST_USERS"
              :key="user.email"
              class="rounded-xl border border-white/8 bg-white/3 p-3 space-y-2"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="space-y-0.5">
                  <p class="text-xs font-semibold text-ink-100">{{ user.fullName }}</p>
                  <p class="text-[11px] text-ink-400">{{ user.city }}</p>
                </div>
                <button
                  class="shrink-0 text-[11px] font-semibold text-warning hover:text-white px-2 py-0.5 rounded-lg border border-warning/30 hover:border-warning/60 transition-colors"
                  @click="fillUser(user)"
                >
                  Usar
                </button>
              </div>
              <div class="text-[11px] text-ink-400 space-y-0.5">
                <p>{{ user.email }}</p>
                <p>{{ user.phone }}</p>
                <p class="truncate">{{ user.address }}, {{ user.city }}</p>
              </div>
            </div>
          </template>

          <!-- ── Tab: Combos (tarjeta + usuario de un click) ─────────── -->
          <template v-else>
            <div
              v-for="combo in TEST_COMBOS"
              :key="combo.label"
              class="rounded-xl border border-white/8 bg-white/3 p-3 space-y-2"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs font-semibold text-ink-100">{{ combo.label }}</p>
                  <p class="text-[11px] text-ink-400">{{ combo.desc }}</p>
                </div>
                <button
                  class="shrink-0 text-[11px] font-bold text-ink-800 bg-warning/90 hover:bg-warning px-3 py-1 rounded-lg transition-colors"
                  @click="fillAll(combo)"
                >
                  Llenar todo
                </button>
              </div>
            </div>
          </template>

        </div>

        <!-- Footer informativo -->
        <div class="px-4 py-2 border-t border-white/10 text-[10px] text-ink-400">
          Entorno de pruebas — solo visible en <code class="text-warning/80">import.meta.env.DEV</code>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Solo activo en modo desarrollo
const isDev = import.meta.env.DEV

const open = ref(false)
const tab = ref<'cards' | 'users' | 'combos'>('combos')

const TABS = [
  { id: 'combos' as const,  label: 'Combos' },
  { id: 'cards' as const,   label: 'Tarjetas' },
  { id: 'users' as const,   label: 'Usuarios' },
]

// ── Tipos locales ──────────────────────────────────────────────────────────────

interface TestCard {
  brand: 'visa' | 'mastercard'
  result: 'APPROVED' | 'DECLINED' | 'PENDING'
  number: string
  expiry: string
  cvv: string
  holder: string
  note?: string
}

interface TestUser {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
}

interface TestCombo {
  label: string
  desc: string
  card: TestCard
  user: TestUser
}

// ── Datos de prueba — tarjetas (sandbox del gateway de pago) ─────────────────
// Números verificados: pasan algoritmo de Luhn Y son reconocidos por el sandbox del gateway

const TEST_CARDS: TestCard[] = [
  {
    brand: 'visa',
    result: 'APPROVED',
    number: '4242424242424242',
    expiry: '12/28',
    cvv: '123',
    holder: 'APPROVED USER',
    note: 'Visa aprobada — caso de éxito',
  },
  {
    brand: 'mastercard',
    result: 'APPROVED',
    number: '4242424242424242',
    expiry: '12/28',
    cvv: '321',
    holder: 'APPROVED USER',
    note: 'Visa aprobada (el sandbox solo tiene una tarjeta aprobada)',
  },
  {
    brand: 'visa',
    result: 'DECLINED',
    number: '4111111111111111',
    expiry: '12/28',
    cvv: '456',
    holder: 'DECLINED USER',
    note: 'Visa rechazada',
  },
  {
    brand: 'visa',
    result: 'PENDING',
    number: '4242424242424242',
    expiry: '12/28',
    cvv: '789',
    holder: 'PENDING USER',
    note: 'El sandbox no tiene tarjeta PENDING — usará APPROVED',
  },
]

// ── Datos de prueba — usuarios de distintas ciudades ──────────────────────────

const TEST_USERS: TestUser[] = [
  {
    fullName: 'Juan Andrés Palacio',
    email: 'juan.palacio@test.com',
    phone: '3001234567',
    address: 'Calle 80 # 50-30 Apto 401',
    city: 'Bogotá',
  },
  {
    fullName: 'María Fernanda García',
    email: 'maria.garcia@test.com',
    phone: '3117654321',
    address: 'Carrera 43A # 25-67',
    city: 'Medellín',
  },
  {
    fullName: 'Carlos Alberto López',
    email: 'carlos.lopez@test.com',
    phone: '3145559876',
    address: 'Avenida 6N # 20-45 Local 3',
    city: 'Cali',
  },
  {
    fullName: 'Ana María Torres',
    email: 'ana.torres@test.com',
    phone: '3009876543',
    address: 'Calle 72 # 57-123 Piso 2',
    city: 'Barranquilla',
  },
  {
    fullName: 'Luis Miguel Moreno',
    email: 'luis.moreno@test.com',
    phone: '3188765432',
    address: 'Carrera 7 # 45-12',
    city: 'Bucaramanga',
  },
]

// ── Combos — llenan formulario completo de un click ──────────────────────────

const TEST_COMBOS: TestCombo[] = [
  {
    label: 'Pago exitoso — Bogotá',
    desc: 'Visa aprobada + usuario de Bogotá',
    card: TEST_CARDS[0],
    user: TEST_USERS[0],
  },
  {
    label: 'Pago exitoso — Medellín',
    desc: 'Mastercard aprobada + usuario de Medellín',
    card: TEST_CARDS[1],
    user: TEST_USERS[1],
  },
  {
    label: 'Pago rechazado — Cali',
    desc: 'Visa rechazada + usuario de Cali',
    card: TEST_CARDS[2],
    user: TEST_USERS[2],
  },
  {
    label: 'Pago pendiente — Barranquilla',
    desc: 'Visa PENDING + usuario de Barranquilla',
    card: TEST_CARDS[3],
    user: TEST_USERS[3],
  },
]

// ── Eventos ───────────────────────────────────────────────────────────────────

const emit = defineEmits<{
  'fill-card': [card: TestCard]
  'fill-user': [user: TestUser]
  'fill-all':  [combo: TestCombo]
}>()

function fillCard(card: TestCard) {
  emit('fill-card', card)
  open.value = false
}

function fillUser(user: TestUser) {
  emit('fill-user', user)
  open.value = false
}

function fillAll(combo: TestCombo) {
  emit('fill-all', combo)
  open.value = false
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCardNumber(number: string): string {
  return number.replace(/(.{4})/g, '$1 ').trim()
}
</script>

<style scoped>
.dev-slide-enter-active,
.dev-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dev-slide-enter-from,
.dev-slide-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}
</style>
