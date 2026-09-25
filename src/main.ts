// Punto de entrada de la app — monta Vue con todos los plugins configurados.
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { store } from './store/index.js'
import { i18n } from './i18n/index.js'
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(i18n)

app.mount('#app')
