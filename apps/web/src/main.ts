import '@cq/ui/primeicons'
import { PrimeVue, ConfirmationService, ToastService } from '@cq/ui'
// @ts-ignore
import LaraPreset from '@cq/ui/presets/lara'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import * as Sentry from '@sentry/vue'
import App from '@/App.vue'
import router from '@/router'
import { env } from '@/config'

const app = createApp(App)

// Initialize sentry as early as possible.
Sentry.init({
  app,
  dsn: env.SENTRY_DSN
})

// Prime vue
app.use(PrimeVue, { unstyled: true, pt: LaraPreset })
app.use(ConfirmationService)
app.use(ToastService)

// Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
app.use(pinia)

// Router
app.use(router)

app.mount('#app')
