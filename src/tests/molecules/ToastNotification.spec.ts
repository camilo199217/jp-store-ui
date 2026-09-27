import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ToastNotification from '@/components/molecules/ToastNotification.vue'

describe('ToastNotification', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('muestra el mensaje pasado como prop', () => {
    const wrapper = mount(ToastNotification, {
      props: { message: 'Error de prueba' },
      global: { stubs: { teleport: true } },
    })

    expect(wrapper.text()).toContain('Error de prueba')
  })

  it('aplica estilos de error cuando type="error"', () => {
    const wrapper = mount(ToastNotification, {
      props: { message: 'Test', type: 'error' },
      global: { stubs: { teleport: true } },
    })

    expect(wrapper.find('.glass-card').classes()).toContain('bg-danger/10')
  })

  it('aplica estilos de éxito cuando type="success"', () => {
    const wrapper = mount(ToastNotification, {
      props: { message: 'Test', type: 'success' },
      global: { stubs: { teleport: true } },
    })

    expect(wrapper.find('.glass-card').classes()).toContain('bg-success/10')
  })

  it('emite el evento close al hacer clic en el botón X', async () => {
    const wrapper = mount(ToastNotification, {
      props: { message: 'Test' },
      global: { stubs: { teleport: true } },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('se auto-cierra después de 5000ms (duration por defecto)', async () => {
    const wrapper = mount(ToastNotification, {
      props: { message: 'Test' },
      global: { stubs: { teleport: true } },
    })

    expect(wrapper.find('.glass-card').exists()).toBe(true)

    vi.advanceTimersByTime(5000)
    await nextTick()

    expect(wrapper.find('.glass-card').exists()).toBe(false)
  })

  it('respeta un duration personalizado', async () => {
    const wrapper = mount(ToastNotification, {
      props: { message: 'Test', duration: 2000 },
      global: { stubs: { teleport: true } },
    })

    vi.advanceTimersByTime(1999)
    await nextTick()
    expect(wrapper.find('.glass-card').exists()).toBe(true)

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(wrapper.find('.glass-card').exists()).toBe(false)
  })
})
