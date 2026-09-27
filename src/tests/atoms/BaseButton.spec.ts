import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/atoms/BaseButton.vue'

describe('BaseButton', () => {
  it('renderiza el slot por defecto', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Comprar ahora' } })

    expect(wrapper.text()).toContain('Comprar ahora')
  })

  it('aplica la clase correcta para variant="primary"', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'primary' } })

    expect(wrapper.find('button').classes()).toContain('bg-primary')
  })

  it('aplica la clase correcta para variant="ghost"', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'ghost' } })

    expect(wrapper.find('button').classes()).toContain('border')
  })

  it('emite el evento click al hacer clic', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BaseButton, { attrs: { onClick } })

    await wrapper.find('button').trigger('click')

    expect(onClick).toHaveBeenCalled()
  })

  it('no emite click cuando está disabled', async () => {
    const wrapper = mount(BaseButton, { props: { disabled: true } })

    expect(wrapper.find('button').element.disabled).toBe(true)
  })

  it('muestra el spinner cuando loading=true', () => {
    const wrapper = mount(BaseButton, { props: { loading: true } })

    expect(wrapper.find('svg.animate-spin').exists()).toBe(true)
  })

  it('aplica el tamaño correcto con prop size="sm"', () => {
    const wrapper = mount(BaseButton, { props: { size: 'sm' } })

    expect(wrapper.find('button').classes()).toContain('px-4')
  })
})
