import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import "@/assets/tailwind.css"
import FontAwesomeIcon from "@/assets/fontawesome"
import Alert from "@/components/common/Alert.vue"
import FormGroup from "@/components/common/FormGroup.vue"
import Input from "@/components/common/Input.vue"
import Switch from "@/components/common/Switch.vue"
import TextArea from "@/components/common/TextArea.vue"
import Button from "@/components/common/Button.vue"
import ProgressBar from "@/components/common/ProgressBar.vue"

const app = createApp(App)
app.component("v-icon", FontAwesomeIcon)
app.component("v-alert", Alert)
app.component("v-form-group", FormGroup)
app.component("v-input", Input)
app.component("v-switch", Switch)
app.component("v-textarea", TextArea)
app.component("v-button", Button)
app.component("v-progress-bar", ProgressBar)
app.use(router)
app.mount("#app")
