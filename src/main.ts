import './app.css'
import ui from '@nuxt/ui/vue-plugin'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import { initialize } from '@/stores'

const app = createApp(App)

// Nuxt UI
app.use(ui)

// Pinia
const pinia = createPinia()
app.use(pinia)
initialize()

// Router
app.use(router)

app.mount('#app')
