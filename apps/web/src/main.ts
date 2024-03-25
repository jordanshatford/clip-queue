import '@cq/ui/primeicons'
import {
  PrimeVue,
  Button,
  Card,
  Column,
  ConfirmationService,
  ConfirmDialog,
  DataTable,
  InputNumber,
  InputSwitch,
  InputText,
  Message,
  MultiSelect,
  TabMenu,
  Toast,
  ToastService
} from '@cq/ui'
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
app.component('BButton', Button)
app.component('CCard', Card)
app.component('ConfirmDialog', ConfirmDialog)
app.component('DataTable', DataTable)
app.component('DataTableColumn', Column)
app.component('InputNumber', InputNumber)
app.component('InputSwitch', InputSwitch)
app.component('InputText', InputText)
app.component('MessageAlert', Message)
app.component('MultiSelect', MultiSelect)
app.component('TabMenu', TabMenu)
app.component('TToast', Toast)
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
app.use(pinia)
app.use(router)
app.mount('#app')
