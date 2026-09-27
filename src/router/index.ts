// Router de la app — 4 rutas que siguen el flujo del checkout.
// La resiliencia se maneja en el guard: si el usuario llega a /summary o /result
// sin un estado válido en el store, lo redirigimos al inicio.
import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store/index.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'products',
      component: () => import('@/views/ProductPage.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue'),
      // Solo se puede acceder si hay un producto seleccionado
      beforeEnter: () => {
        if (!store.getters['products/selectedProduct']) {
          return { name: 'products' }
        }
      },
    },
    {
      path: '/summary',
      name: 'summary',
      component: () => import('@/views/SummaryView.vue'),
      // Solo se puede acceder si hay cliente y token de tarjeta
      beforeEnter: () => {
        const step = store.state.checkout.step
        if (step !== 'summary' && step !== 'result') {
          return { name: 'products' }
        }
      },
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('@/views/FinalStatusView.vue'),
      // Solo si hay una transacción en el store
      beforeEnter: () => {
        if (!store.state.checkout.transaction) {
          return { name: 'products' }
        }
      },
    },
    // Ruta 404 — muestra el componente correspondiente sin redirigir,
    // así la URL queda tal como la escribió el usuario
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  // Scroll al top en cada navegación
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
})

export default router
