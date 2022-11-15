import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
import twitch from "@/services/twitch"
import { useUser } from "@/stores/user"
import HomePage from "@/views/HomePage.vue"
import QueuePage from "@/views/QueuePage.vue"
import RedditPage from "@/views/RedditPage.vue"
import HistoryPage from "@/views/HistoryPage.vue"
import SettingsPage from "@/views/SettingsPage.vue"

export enum RouteNameConstants {
  HOME = "home",
  QUEUE = "queue",
  REDDIT = "reddit",
  HISTORY = "history",
  SETTINGS = "settings",
}

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: RouteNameConstants.HOME,
    component: HomePage,
    meta: {
      title: "Home",
      requiresAuth: false,
    },
  },
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
    ...routes,
    {
      path: "/:pathMatch(.*)*",
      redirect: { name: RouteNameConstants.HOME },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const user = useUser()
  // If the user is trying to login via twitch
  if (to.hash && to.hash !== "" && !user.isLoggedIn) {
    const authInfo = twitch.login(to.hash)
    if (authInfo !== null) {
      user.login(authInfo)
    }
    next({ name: RouteNameConstants.QUEUE, hash: "" })
    return
    // User is not logged in trying to access auth required route
  } else if (!user.isLoggedIn && to.meta.requiresAuth) {
    next({ name: RouteNameConstants.HOME })
    return
  }
  next()
})

export default router
