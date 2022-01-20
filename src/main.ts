import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/tailwind.css";
import FontAwesomeIcon from "@/assets/fontawesome";

const app = createApp(App);
app.component("v-icon", FontAwesomeIcon);
app.use(router);
app.mount("#app");
