import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AmexLogo from '@/components/atoms/AmexLogo.vue'
import DinersLogo from '@/components/atoms/DinersLogo.vue'
import DiscoverLogo from '@/components/atoms/DiscoverLogo.vue'
import MastercardLogo from '@/components/atoms/MastercardLogo.vue'
import VisaLogo from '@/components/atoms/VisaLogo.vue'

describe('Logos de marcas de tarjeta', () => {
  it('AmexLogo renderiza un SVG', () => {
    const wrapper = mount(AmexLogo)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('DinersLogo renderiza un SVG', () => {
    const wrapper = mount(DinersLogo)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('DiscoverLogo renderiza un SVG', () => {
    const wrapper = mount(DiscoverLogo)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('MastercardLogo renderiza un SVG', () => {
    const wrapper = mount(MastercardLogo)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('VisaLogo renderiza un SVG', () => {
    const wrapper = mount(VisaLogo)
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
