import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
import twitch from "@/services/twitch"
import { useUser } from "@/stores/user"
import Queue from "@/views/Queue.vue"
import Reddit from "@/views/Reddit.vue"
import Landing from "@/views/Landing.vue"
import Settings from "@/views/Settings.vue"

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/queue",
    name: "Queue",
    component: Queue,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/reddit",
    name: "From Reddit",
    component: Reddit,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: {
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Landing",
      component: Landing,
    },
    ...routes,
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
})

router.beforeEach((to, from, next) => {
  const user = useUser()
  if (to.hash && to.hash !== "" && !user.isLoggedIn) {
    const authInfo = twitch.login(to.hash)
    if (authInfo !== null) {
      user.login(authInfo)
    }
    next({ path: "/queue", hash: "" })
    return
  } else if (!user.isLoggedIn && to.meta.requiresAuth) {
    next({ path: "/" })
    return
  }
  next()
})

export default router
