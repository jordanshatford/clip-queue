import '@cq/ui/primeicons'
import { PrimeVue, ConfirmationService, ToastService } from '@cq/ui'
// @ts-ignore
import LaraPreset from '@cq/ui/presets/lara'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import App from '@/App.vue'
import router from '@/router'

const app = createApp(App)
app.use(PrimeVue, { unstyled: true, pt: LaraPreset })
app.use(ConfirmationService)
app.use(ToastService)
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
app.use(pinia)
app.use(router)
app.mount('#app')
