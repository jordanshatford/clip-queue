import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
import twitch from "@/services/twitch"
import { useUser } from "@/stores/user"
import LandingPage from "@/views/LandingPage.vue"
import QueuePage from "@/views/QueuePage.vue"
import RedditPage from "@/views/RedditPage.vue"
import HistoryPage from "@/views/HistoryPage.vue"
import SettingsPage from "@/views/SettingsPage.vue"

export enum RouteNameConstants {
  LANDING = "landing",
  QUEUE = "queue",
  REDDIT = "reddit",
  HISTORY = "history",
  SETTINGS = "settings",
}

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/queue",
    name: RouteNameConstants.QUEUE,
    component: QueuePage,
    meta: {
      title: "Queue",
      requiresAuth: true,
    },
  },
  {
    path: "/reddit",
    name: RouteNameConstants.REDDIT,
    component: RedditPage,
    meta: {
      title: "From Reddit",
      requiresAuth: true,
    },
  },
  {
    path: "/history",
    name: RouteNameConstants.HISTORY,
    component: HistoryPage,
    meta: {
      title: "History",
      requiresAuth: true,
    },
  },
  {
    path: "/settings",
    name: RouteNameConstants.SETTINGS,
    component: SettingsPage,
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
      component: LandingPage,
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
