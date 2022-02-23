import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
import twitch from "@/services/twitch"
import { useUser } from "@/stores/user"
import Queue from "@/views/Queue.vue"
import Reddit from "@/views/Reddit.vue"
import Landing from "@/views/Landing.vue"
import Settings from "@/views/Settings.vue"

export enum RouteNameConstants {
  LANDING = "landing",
  QUEUE = "queue",
  REDDIT = "reddit",
  SETTINGS = "settings",
}

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/queue",
    name: RouteNameConstants.QUEUE,
    component: Queue,
    meta: {
      title: "Queue",
      requiresAuth: true,
    },
  },
  {
    path: "/reddit",
    name: RouteNameConstants.REDDIT,
    component: Reddit,
    meta: {
      title: "From Reddit",
      requiresAuth: true,
    },
  },
  {
    path: "/settings",
    name: RouteNameConstants.SETTINGS,
    component: Settings,
    meta: {
      title: "Settings",
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: RouteNameConstants.LANDING,
      component: Landing,
    },
    ...routes,
    {
      path: "/:pathMatch(.*)*",
      redirect: { name: RouteNameConstants.LANDING },
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
    next({ name: RouteNameConstants.QUEUE, hash: "" })
    return
  } else if (!user.isLoggedIn && to.meta.requiresAuth) {
    next({ name: RouteNameConstants.LANDING })
    return
  }
  next()
})

export default router
