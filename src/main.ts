import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/tailwind.css";
import FontAwesomeIcon from "@/assets/fontawesome";
import Button from "@/components/common/Button.vue";

const app = createApp(App);
app.component("v-icon", FontAwesomeIcon);
app.component("v-button", Button);
app.use(router);
app.mount("#app");
