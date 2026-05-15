import './app.css'
import ui from '@nuxt/ui/vue-plugin'
import Aura from '@primeuix/themes/aura'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import { initialize } from '@/stores'

const app = createApp(App)

// PrimeVue
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue',
      },
    },
  },
})
app.use(ui)
app.use(ConfirmationService)
app.use(ToastService)
app.directive('tooltip', Tooltip)

// Pinia
const pinia = createPinia()
app.use(pinia)
initialize()

// Router
app.use(router)

app.mount('#app')
