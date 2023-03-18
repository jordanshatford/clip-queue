import '@/assets/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import Toastification, { type PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from '@/App.vue'
import router from '@/router'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseTag from '@/components/ui/BaseTag.vue'
import BaseTextArea from '@/components/ui/BaseTextArea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseMultiTagSelect from '@/components/ui/BaseMultiTagSelect.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseTable from '@/components/ui/BaseTable.vue'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
app.use(pinia)
app.use(Toastification, {
  transition: 'Vue-Toastification__bounce',
  position: 'bottom-center',
  timeout: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  showCloseButtonOnHover: true,
  icon: true
} as PluginOptions)
app
  .component('BaseInput', BaseInput)
  .component('BaseSwitch', BaseSwitch)
  .component('BaseTabs', BaseTabs)
  .component('BaseTag', BaseTag)
  .component('BaseTextArea', BaseTextArea)
  .component('BaseButton', BaseButton)
  .component('BaseMultiTagSelect', BaseMultiTagSelect)
  .component('BasePagination', BasePagination)
  .component('BaseTable', BaseTable)
app.use(router)
app.mount('#app')
