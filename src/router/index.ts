import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import TwitchAuth from "@/services/twitch-auth";
import { userStore } from "@/stores/user";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  if (to.hash && to.hash != "" && !userStore.user.isLoggedIn) {
    const authInfo = TwitchAuth.login(to.hash);
    if (authInfo !== null) {
      userStore.loginWithTwitchAuth(
        authInfo.access_token,
        authInfo.id_token,
        authInfo.decodedIdToken?.preferred_username
      );
    }
    next({ path: "/", hash: "" });
    return;
  }
  next();
});

export default router;
