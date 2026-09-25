<template>
  <!-- Formulario de checkout — dos secciones: tarjeta y datos de entrega.
       VeeValidate maneja todas las validaciones en tiempo real.
       La tarjeta animada (CreditCardVisual) se actualiza con cada keystroke. -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

    <!-- Columna izquierda: tarjeta visual + formulario de tarjeta -->
    <div class="space-y-6">
      <!-- Tarjeta 3D animada — se actualiza en tiempo real -->
      <CreditCardVisual
        :card-number="cardNumberRaw"
        :card-name="cardName || t('checkout.cardNamePlaceholder')"
        :card-expiry="cardExpiry || 'MM/AA'"
        :card-cvv="cardCvv || '•••'"
        :brand="brand"
        :show-back="cvvFocused"
      />

      <div class="glass-card p-6 space-y-4">
        <h3 class="text-sm font-semibold text-ink-300 uppercase tracking-wider">
          {{ t('checkout.cardSection') }}
        </h3>

        <!-- Número de tarjeta -->
        <div>
          <BaseInput
            :model-value="cardNumberDisplayed"
            :label="t('checkout.cardNumber')"
            :placeholder="t('checkout.cardNumberPlaceholder')"
            :error="errors.cardNumber"
            :maxlength="19"
            inputmode="numeric"
            @update:model-value="onCardNumberChange"
          >
            <template v-if="brand !== 'unknown'" #suffix>
              <VisaLogo v-if="brand === 'visa'" class="w-8 h-5" />
              <MastercardLogo v-else class="w-8 h-5" />
            </template>
          </BaseInput>
        </div>

        <!-- Nombre en tarjeta -->
        <BaseInput
          v-model="cardName"
          :label="t('checkout.cardName')"
          :placeholder="t('checkout.cardNamePlaceholder')"
          :error="errors.cardName"
          autocomplete="cc-name"
        />

        <!-- Vencimiento y CVV en fila -->
        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            :model-value="cardExpiry"
            :label="t('checkout.cardExpiry')"
            :placeholder="t('checkout.cardExpiryPlaceholder')"
            :error="errors.cardExpiry"
            :maxlength="5"
            inputmode="numeric"
            @update:model-value="onExpiryChange"
          />

          <BaseInput
            v-model="cardCvv"
            :label="t('checkout.cardCvv')"
            :placeholder="t('checkout.cardCvvPlaceholder')"
            :error="errors.cardCvv"
            :maxlength="4"
            inputmode="numeric"
            type="password"
            @focus="cvvFocused = true"
            @blur="cvvFocused = false"
          />
        </div>
      </div>
    </div>

    <!-- Columna derecha: datos de entrega -->
    <div class="glass-card p-6 space-y-4">
      <h3 class="text-sm font-semibold text-ink-300 uppercase tracking-wider">
        {{ t('checkout.deliverySection') }}
      </h3>

      <BaseInput
        v-model="fullName"
        :label="t('checkout.fullName')"
        :placeholder="t('checkout.fullNamePlaceholder')"
        :error="errors.fullName"
        autocomplete="name"
      />

      <BaseInput
        v-model="email"
        :label="t('checkout.email')"
        :placeholder="t('checkout.emailPlaceholder')"
        :error="errors.email"
        type="email"
        autocomplete="email"
      />

      <BaseInput
        v-model="phone"
        :label="t('checkout.phone')"
        :placeholder="t('checkout.phonePlaceholder')"
        :error="errors.phone"
        type="tel"
        autocomplete="tel"
        inputmode="tel"
      />

      <BaseInput
        v-model="address"
        :label="t('checkout.address')"
        :placeholder="t('checkout.addressPlaceholder')"
        :error="errors.address"
        autocomplete="street-address"
      />

      <BaseInput
        v-model="city"
        :label="t('checkout.city')"
        :placeholder="t('checkout.cityPlaceholder')"
        :error="errors.city"
        autocomplete="address-level2"
      />

      <!-- Indicadores de seguridad -->
      <div class="flex items-center gap-4 pt-2 border-t border-white/10">
        <div class="flex items-center gap-1.5 text-xs text-ink-400">
          <svg class="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
          </svg>
          {{ t('checkout.securePayment') }}
        </div>
        <div class="flex items-center gap-1.5 text-xs text-ink-400">
          <svg class="w-3.5 h-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          {{ t('checkout.encrypted') }}
        </div>
      </div>
    </div>
  </div>

  <!-- Botones de acción -->
  <div class="flex justify-between items-center mt-8">
    <BaseButton variant="ghost" @click="emit('back')">
      ← {{ t('checkout.back') }}
    </BaseButton>

    <BaseButton
      :loading="processing"
      :disabled="!meta.valid || processing"
      @click="submit"
    >
      {{ t('checkout.next') }}
    </BaseButton>
  </div>

  <!-- Toast de error si el procesamiento falla -->
  <ToastNotification
    v-if="submitError"
    :message="t(`errors.${submitError}`)"
    type="error"
    @close="submitError = null"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import CreditCardVisual from '@/components/molecules/CreditCardVisual.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import VisaLogo from '@/components/atoms/VisaLogo.vue'
import MastercardLogo from '@/components/atoms/MastercardLogo.vue'
import ToastNotification from '@/components/molecules/ToastNotification.vue'
import { useCardDetection } from '@/composables/useCardDetection.js'

const { t } = useI18n()
const store = useStore()
const router = useRouter()

const emit = defineEmits<{ back: [] }>()

// ─── Estado local ─────────────────────────────────────────────────────────────
// cardNumberRaw guarda solo dígitos para la detección de marca
const cardNumberRaw = ref('')
// cardNumberDisplayed guarda el número con espacios para mostrar en el input
const cardNumberDisplayed = ref('')
const cvvFocused = ref(false)
const submitError = ref<string | null>(null)
const processing = ref(false)

// Detección de marca en tiempo real
const { brand } = useCardDetection(() => cardNumberRaw.value)

// ─── Validaciones con VeeValidate ─────────────────────────────────────────────

function luhnCheck(number: string): boolean {
  // Algoritmo de Luhn — valida que el número de tarjeta sea estructuralmente válido
  const digits = number.replace(/\D/g, '')
  let sum = 0
  let shouldDouble = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10)
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }
  return sum % 10 === 0
}

const { errors, meta, handleSubmit } = useForm({
  validationSchema: {
    cardNumber: (val: string) => {
      if (!val) return t('validation.required')
      if (val.length < 13 || val.length > 19) return t('validation.cardNumber')
      if (!luhnCheck(val)) return t('validation.cardNumber')
      return true
    },
    cardName: (val: string) => {
      if (!val?.trim()) return t('validation.required')
      if (val.trim().length < 3) return t('validation.cardName')
      return true
    },
    cardExpiry: (val: string) => {
      if (!val) return t('validation.required')
      const match = val.match(/^(\d{2})\/(\d{2})$/)
      if (!match) return t('validation.cardExpiry')
      const month = parseInt(match[1], 10)
      const year = parseInt(`20${match[2]}`, 10)
      const now = new Date()
      if (month < 1 || month > 12) return t('validation.cardExpiry')
      if (new Date(year, month - 1) < new Date(now.getFullYear(), now.getMonth())) return t('validation.cardExpiry')
      return true
    },
    cardCvv: (val: string) => {
      if (!val) return t('validation.required')
      if (!/^\d{3,4}$/.test(val)) return t('validation.cardCvv')
      return true
    },
    fullName: (val: string) => {
      if (!val?.trim()) return t('validation.required')
      if (val.trim().length < 3) return t('validation.minLength', { min: 3 })
      return true
    },
    email: (val: string) => {
      if (!val) return t('validation.required')
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return t('validation.email')
      return true
    },
    phone: (val: string) => {
      if (!val) return t('validation.required')
      if (!/^\d{7,15}$/.test(val.replace(/\D/g, ''))) return t('validation.phone')
      return true
    },
    address: (val: string) => {
      if (!val?.trim()) return t('validation.required')
      if (val.trim().length < 5) return t('validation.address')
      return true
    },
    city: (val: string) => {
      if (!val?.trim()) return t('validation.required')
      if (val.trim().length < 2) return t('validation.city')
      return true
    },
  },
})

// Registro cada campo — VeeValidate los rastrea para las validaciones
const { value: cardNumberVal, handleChange: setCardNumber } = useField<string>('cardNumber')
const { value: cardName } = useField<string>('cardName')
const { value: cardExpiry, handleChange: setCardExpiry } = useField<string>('cardExpiry')
const { value: cardCvv } = useField<string>('cardCvv')
const { value: fullName } = useField<string>('fullName')
const { value: email } = useField<string>('email')
const { value: phone } = useField<string>('phone')
const { value: address } = useField<string>('address')
const { value: city } = useField<string>('city')

// ─── Formateo automático de inputs ───────────────────────────────────────────

function onCardNumberChange(raw: string) {
  // Extraigo solo dígitos para validación y detección de marca
  const digits = raw.replace(/\D/g, '').substring(0, 16)
  cardNumberRaw.value = digits
  // Formato para visualización: grupos de 4 con espacios
  cardNumberDisplayed.value = digits.replace(/(.{4})/g, '$1 ').trim()
  // Le digo a VeeValidate el valor limpio (sin espacios) para validar
  setCardNumber(digits)
}

function onExpiryChange(val: string) {
  // Auto-inserto "/" al completar los 2 dígitos del mes
  const digits = val.replace(/\D/g, '').substring(0, 4)
  const formatted = digits.length >= 3 ? `${digits.substring(0, 2)}/${digits.substring(2)}` : digits
  setCardExpiry(formatted)
}

// ─── Pre-relleno de datos de prueba (solo DEV) ───────────────────────────────

export interface PrefillData {
  cardNumber?: string
  cardName?: string
  cardExpiry?: string
  cardCvv?: string
  fullName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
}

function fill(data: PrefillData) {
  if (data.cardNumber) onCardNumberChange(data.cardNumber)
  if (data.cardName)   cardName.value = data.cardName
  if (data.cardExpiry) onExpiryChange(data.cardExpiry.replace('/', ''))
  if (data.cardCvv)    cardCvv.value = data.cardCvv
  if (data.fullName)   fullName.value = data.fullName
  if (data.email)      email.value = data.email
  if (data.phone)      phone.value = data.phone
  if (data.address)    address.value = data.address
  if (data.city)       city.value = data.city
}

defineExpose({ fill })

// ─── Envío del formulario ─────────────────────────────────────────────────────

const submit = handleSubmit(async (vals) => {
  processing.value = true
  submitError.value = null

  store.dispatch('checkout/saveFormData', {
    cardNumber: vals.cardNumber,
    cardName: vals.cardName,
    cardExpiry: vals.cardExpiry,
    cardCvv: vals.cardCvv,
    fullName: vals.fullName,
    email: vals.email,
    phone: vals.phone,
    address: vals.address,
    city: vals.city,
    installments: 1,
  })

  // El store crea al cliente en el backend y tokeniza la tarjeta directamente con el gateway
  await store.dispatch('checkout/submitCheckout')

  const error = store.getters['checkout/error']
  if (error) {
    submitError.value = error
    processing.value = false
    return
  }

  router.push({ name: 'summary' })
  processing.value = false
})
</script>
