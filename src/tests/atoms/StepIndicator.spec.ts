import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StepIndicator from '@/components/atoms/StepIndicator.vue'

describe('StepIndicator', () => {
  it('renderiza los 4 pasos del flujo', () => {
    const wrapper = mount(StepIndicator, { props: { currentStep: 0 } })
    const circles = wrapper.findAll('.rounded-full')
    expect(circles.length).toBeGreaterThanOrEqual(4)
  })

  it('marca el paso actual con color primario', () => {
    const wrapper = mount(StepIndicator, { props: { currentStep: 1 } })
    expect(wrapper.html()).toContain('bg-primary')
  })

  it('marca los pasos completados con color success', () => {
    const wrapper = mount(StepIndicator, { props: { currentStep: 2 } })
    expect(wrapper.html()).toContain('bg-success')
  })

  it('muestra el ícono de check en pasos completados', () => {
    const wrapper = mount(StepIndicator, { props: { currentStep: 3 } })
    expect(wrapper.findAll('svg').length).toBeGreaterThan(0)
  })

  it('muestra el número en pasos no completados', () => {
    const wrapper = mount(StepIndicator, { props: { currentStep: 0 } })
    expect(wrapper.html()).toContain('2')
    expect(wrapper.html()).toContain('3')
  })
})
