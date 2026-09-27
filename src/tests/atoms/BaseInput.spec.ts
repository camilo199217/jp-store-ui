import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '@/components/atoms/BaseInput.vue'

describe('BaseInput', () => {
  it('renderiza el label correctamente', () => {
    const wrapper = mount(BaseInput, { props: { label: 'Nombre' } })

    expect(wrapper.find('label').text()).toContain('Nombre')
  })

  it('emite el valor al escribir (v-model)', async () => {
    const wrapper = mount(BaseInput)

    await wrapper.find('input').setValue('hola')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hola'])
  })

  it('muestra el mensaje de error cuando se pasa la prop error', () => {
    const wrapper = mount(BaseInput, { props: { error: 'Campo requerido' } })

    expect(wrapper.text()).toContain('Campo requerido')
  })

  it('aplica clase de error en el input cuando hay error', () => {
    const wrapper = mount(BaseInput, { props: { error: 'Campo requerido' } })

    expect(wrapper.find('input').classes()).toContain('border-danger/60')
  })

  it('aplica clase de éxito cuando no hay error y hay valor', () => {
    const wrapper = mount(BaseInput, { props: { isValid: true, modelValue: 'algo' } })

    expect(wrapper.find('input').classes()).toContain('border-success/60')
  })

  it('renderiza el slot prefix', () => {
    const wrapper = mount(BaseInput, { slots: { prefix: '<span>@</span>' } })

    expect(wrapper.text()).toContain('@')
  })

  it('renderiza el slot suffix', () => {
    const wrapper = mount(BaseInput, { slots: { suffix: '<span>€</span>' } })

    expect(wrapper.text()).toContain('€')
  })
})
