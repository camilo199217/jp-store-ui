import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseBadge from '@/components/atoms/BaseBadge.vue'

describe('BaseBadge', () => {
  it('renderiza el texto del slot', () => {
    const wrapper = mount(BaseBadge, { slots: { default: 'En stock' } })

    expect(wrapper.text()).toContain('En stock')
  })

  it('aplica las clases de variant="success"', () => {
    const wrapper = mount(BaseBadge, { props: { variant: 'success' } })

    expect(wrapper.html()).toContain('bg-success/80')
  })

  it('aplica las clases de variant="danger"', () => {
    const wrapper = mount(BaseBadge, { props: { variant: 'danger' } })

    expect(wrapper.html()).toContain('bg-danger/10')
  })

  it('muestra el indicador dot cuando dot=true', () => {
    const wrapper = mount(BaseBadge, { props: { dot: true } })

    expect(wrapper.find('.rounded-full').exists()).toBe(true)
  })

  it('no muestra el dot cuando dot=false (default)', () => {
    const wrapper = mount(BaseBadge)

    expect(wrapper.find('.rounded-full').exists()).toBe(false)
  })
})
