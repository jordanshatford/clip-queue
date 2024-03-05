import '@/assets/tailwind.css'
import '@/assets/base.css'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Chips from 'primevue/chips'
import Column from 'primevue/column'
import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'
import DataTable from 'primevue/datatable'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import TabMenu from 'primevue/tabmenu'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import Toastification, { type PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from '@/App.vue'
import router from '@/router'
// @ts-ignore
import Lara from '@/assets/presets/lara'

const app = createApp(App)
app.use(PrimeVue, { unstyled: true, pt: Lara })
app.use(ConfirmationService)
app.component('BButton', Button)
app.component('ConfirmDialog', ConfirmDialog)
app.component('DataTable', DataTable)
app.component('DataTableColumn', Column)
app.component('InputChips', Chips)
app.component('InputNumber', InputNumber)
app.component('InputSwitch', InputSwitch)
app.component('InputText', InputText)
app.component('MultiSelect', MultiSelect)
app.component('TabMenu', TabMenu)
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
app.use(router)
app.mount('#app')
