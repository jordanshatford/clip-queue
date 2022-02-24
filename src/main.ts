import "@/assets/tailwind.css"
import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "@/App.vue"
import router from "@/router"
import sentry from "@/services/sentry"
import Alert from "@/components/ui/Alert.vue"
import Input from "@/components/ui/Input.vue"
import Switch from "@/components/ui/Switch.vue"
import TextArea from "@/components/ui/TextArea.vue"
import Button from "@/components/ui/Button.vue"

const app = createApp(App)
sentry.init(app)
app.use(createPinia())
app.component("v-alert", Alert)
app.component("v-input", Input)
app.component("v-switch", Switch)
app.component("v-textarea", TextArea)
app.component("v-button", Button)
app.use(router)
app.mount("#app")
