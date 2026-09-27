import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import NotFoundView from '@/views/NotFoundView.vue'

function makeRouter(path = '/ruta-inexistente') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/',         name: 'products', component: { template: '<div/>' } },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
    ],
  })
  router.push(path)
  return router
}

describe('NotFoundView', () => {
  it('renderiza el número 404', async () => {
    const router = makeRouter()
    await router.isReady()
    const wrapper = mount(NotFoundView, { global: { plugins: [router] } })
    expect(wrapper.html()).toContain('404')
  })

  it('muestra la ruta actual en el mensaje de error', async () => {
    const router = makeRouter('/esta-pagina-no-existe')
    await router.isReady()
    const wrapper = mount(NotFoundView, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('esta-pagina-no-existe')
  })

  it('tiene el botón para ir a la tienda', async () => {
    const router = makeRouter()
    await router.isReady()
    const wrapper = mount(NotFoundView, { global: { plugins: [router] } })
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toContain('tienda')
  })

  it('navega a products al hacer clic en el botón', async () => {
    const router = makeRouter()
    await router.isReady()
    const pushSpy = vi.spyOn(router, 'push')
    const wrapper = mount(NotFoundView, { global: { plugins: [router] } })
    await wrapper.find('button').trigger('click')
    expect(pushSpy).toHaveBeenCalledWith({ name: 'products' })
  })
})
