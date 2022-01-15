import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import TwitchAuth from "@/services/twitch-auth";
import { userStore } from "@/stores/user";
import Queue from "@/views/Queue.vue";
import Landing from "@/views/Landing.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/queue",
    name: "Queue",
    component: Queue,
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

router.beforeEach((to, from, next) => {
  if (to.hash && to.hash !== "" && !userStore.user.isLoggedIn) {
    const authInfo = TwitchAuth.login(to.hash);
    if (authInfo !== null) {
      userStore.loginWithTwitchAuth(
        authInfo.access_token,
        authInfo.id_token,
        authInfo.decodedIdToken?.preferred_username
      );
    }
    next({ path: "/queue", hash: "" });
    return;
  } else if (!userStore.user.isLoggedIn && (from.path !== "/" || to.path !== "/")) {
    next({ path: "/" });
    return;
  }
  next();
});

export default router;
