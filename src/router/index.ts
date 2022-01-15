import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import TwitchAuth from "@/services/twitch-auth";
import { userStore } from "@/stores/user";
import Home from "@/views/Home.vue";
import Landing from "@/views/Landing.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Landing",
      component: Landing,
    },
    ...routes,
  ],
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
