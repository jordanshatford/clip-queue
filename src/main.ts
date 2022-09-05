import "@/assets/tailwind.css"
import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "@/App.vue"
import router from "@/router"
import sentry from "@/services/sentry"
import BaseAlert from "@/components/ui/BaseAlert.vue"
import BaseInput from "@/components/ui/BaseInput.vue"
import BaseSwitch from "@/components/ui/BaseSwitch.vue"
import BaseTextArea from "@/components/ui/BaseTextArea.vue"
import BaseButton from "@/components/ui/BaseButton.vue"

const app = createApp(App)
sentry.init(app)
app.use(createPinia())
app
  .component("BaseAlert", BaseAlert)
  .component("BaseInput", BaseInput)
  .component("BaseSwitch", BaseSwitch)
  .component("BaseTextArea", BaseTextArea)
  .component("BaseButton", BaseButton)
app.use(router)
app.mount("#app")
