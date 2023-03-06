import '@/assets/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import App from '@/App.vue'
import router from '@/router'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseTag from '@/components/ui/BaseTag.vue'
import BaseTextArea from '@/components/ui/BaseTextArea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseMultiTagSelect from '@/components/ui/BaseMultiTagSelect.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import ConfirmPlugin from '@/plugins/confirm'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
app.use(pinia)
app.use(ConfirmPlugin)
app
  .component('BaseAlert', BaseAlert)
  .component('BaseInput', BaseInput)
  .component('BaseSwitch', BaseSwitch)
  .component('BaseTabs', BaseTabs)
  .component('BaseTag', BaseTag)
  .component('BaseTextArea', BaseTextArea)
  .component('BaseButton', BaseButton)
  .component('BaseMultiTagSelect', BaseMultiTagSelect)
  .component('BasePagination', BasePagination)
app.use(router)
app.mount('#app')
