import '@cq/ui/primeicons'

import { ConfirmationService, PrimeVue, ToastService, Tooltip } from '@cq/ui'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'

const app = createApp(App)

// PrimeVue
app.use(PrimeVue, { unstyled: true })
app.use(ConfirmationService)
app.use(ToastService)
app.directive('tooltip', Tooltip)

// Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
app.use(pinia)

// Router
app.use(router)

app.mount('#app')
