import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkeletonCard from '@/components/atoms/SkeletonCard.vue'

describe('SkeletonCard', () => {
  it('renderiza los placeholders de skeleton', () => {
    const wrapper = mount(SkeletonCard)
    expect(wrapper.findAll('.skeleton').length).toBeGreaterThan(0)
  })

  it('tiene la estructura de tarjeta con imagen y contenido', () => {
    const wrapper = mount(SkeletonCard)
    expect(wrapper.html()).toBeTruthy()
    expect(wrapper.find('.glass-card').exists()).toBe(true)
  })
})
