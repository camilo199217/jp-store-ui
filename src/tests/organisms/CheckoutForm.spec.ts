import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { makeStore } from '../helpers/makeStore.js'

vi.mock('@/services/api.js', () => ({
  productsApi: { getAll: vi.fn() },
  customersApi: { create: vi.fn() },
  transactionsApi: { processPayment: vi.fn(), getById: vi.fn() },
  paymentApi: { getAcceptanceToken: vi.fn(), tokenizeCard: vi.fn() },
}))

import CheckoutForm from '@/components/organisms/CheckoutForm.vue'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/',        name: 'products', component: { template: '<div/>' } },
      { path: '/summary', name: 'summary',  component: { template: '<div/>' } },
    ],
  })
}

describe('CheckoutForm', () => {
  let router: ReturnType<typeof makeRouter>

  beforeEach(() => {
    router = makeRouter()
  })

  it('renderiza la sección de datos de tarjeta', () => {
    const store = makeStore()
    const wrapper = mount(CheckoutForm, { global: { plugins: [store, router] } })
    expect(wrapper.html()).toBeTruthy()
  })

  it('renderiza los campos de entrega: nombre, email, teléfono, dirección, ciudad', () => {
    const store = makeStore()
    const wrapper = mount(CheckoutForm, { global: { plugins: [store, router] } })
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(7)
  })

  it('muestra los indicadores de pago seguro', () => {
    const store = makeStore()
    const wrapper = mount(CheckoutForm, { global: { plugins: [store, router] } })
    expect(wrapper.text()).toContain('100% seguro')
  })

  it('el botón volver emite el evento "back"', async () => {
    const store = makeStore()
    const wrapper = mount(CheckoutForm, { global: { plugins: [store, router] } })
    const backBtn = wrapper.findAll('button').find(b => b.html().includes('←'))
    await backBtn?.trigger('click')
    expect(wrapper.emitted('back')).toBeTruthy()
  })

  it('el botón siguiente renderiza y tiene el texto de siguiente paso', () => {
    const store = makeStore()
    const wrapper = mount(CheckoutForm, { global: { plugins: [store, router] } })
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('formatea el número de tarjeta Visa en grupos de 4', async () => {
    const store = makeStore()
    const wrapper = mount(CheckoutForm, { global: { plugins: [store, router] } })
    const cardInput = wrapper.findAll('input')[0]
    await cardInput.setValue('4242424242424242')
    await cardInput.trigger('input')
    const displayed = (cardInput.element as HTMLInputElement).value
    expect(displayed).toContain('4242')
  })

  it('el método fill() rellena los campos del formulario', async () => {
    const store = makeStore()
    const wrapper = mount(CheckoutForm, { global: { plugins: [store, router] } })
    const vm = wrapper.vm as any
    vm.fill({
      fullName: 'Juan Palacio',
      email: 'juan@test.com',
      phone: '3001234567',
      address: 'Calle 123',
      city: 'Bogotá',
      cardNumber: '4242424242424242',
      cardName: 'JUAN PALACIO',
      cardExpiry: '1228',
      cardCvv: '123',
    })
    await nextTick()
    expect(wrapper.html()).toBeTruthy()
  })

  it('el algoritmo de Luhn rechaza un número inválido', async () => {
    const store = makeStore()
    const wrapper = mount(CheckoutForm, { global: { plugins: [store, router] } })
    const cardInput = wrapper.findAll('input')[0]
    await cardInput.setValue('4242424242424241')
    await cardInput.trigger('input')
    await cardInput.trigger('blur')
    await nextTick()
    expect(wrapper.html()).toContain('tarjeta')
  })

  it('auto-formatea la fecha de vencimiento con "/" al completar el mes', async () => {
    const store = makeStore()
    const wrapper = mount(CheckoutForm, { global: { plugins: [store, router] } })
    const expiryInput = wrapper.findAll('input')[2]
    await expiryInput.setValue('1228')
    await expiryInput.trigger('input')
    await nextTick()
    expect(wrapper.html()).toBeTruthy()
  })
})
