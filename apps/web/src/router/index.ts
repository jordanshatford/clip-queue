import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import twitch from '@cq/services/twitch'
import { config } from '@/assets/config'
import { useUser } from '@/stores/user'
import HomePage from '@/views/HomePage.vue'
import QueuePage from '@/views/QueuePage.vue'
import HistoryPage from '@/views/HistoryPage.vue'
import SettingsPage from '@/views/SettingsPage.vue'
import ChatSettings from '@/views/settings/ChatSettings.vue'
import QueueSettings from '@/views/settings/QueueSettings.vue'
import OtherSettings from '@/views/settings/OtherSettings.vue'

export enum RouteNameConstants {
  HOME = 'home',
  QUEUE = 'queue',
  HISTORY = 'history',
  SETTINGS = 'settings',
  SETTINGS_CHAT = 'settings_chat',
  SETTINGS_QUEUE = 'settings_queue',
  SETTINGS_OTHER = 'settings_other'
}

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/queue',
    name: RouteNameConstants.QUEUE,
    component: QueuePage,
    meta: {
      title: 'Queue',
      requiresAuth: true
    }
  },
  {
    path: '/history',
    name: RouteNameConstants.HISTORY,
    component: HistoryPage,
    meta: {
      title: 'History',
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: RouteNameConstants.SETTINGS,
    redirect: { name: RouteNameConstants.SETTINGS_CHAT },
    component: SettingsPage,
    meta: {
      title: 'Settings',
      requiresAuth: true
    },
    children: [
      {
        path: 'chat',
        name: RouteNameConstants.SETTINGS_CHAT,
        component: ChatSettings,
        meta: {
          title: 'Chat Settings',
          requiresAuth: true
        }
      },
      {
        path: 'queue',
        name: RouteNameConstants.SETTINGS_QUEUE,
        component: QueueSettings,
        meta: {
          title: 'Queue Settings',
          requiresAuth: true
        }
      },
      {
        path: 'other',
        name: RouteNameConstants.SETTINGS_OTHER,
        component: OtherSettings,
        meta: {
          title: 'Other Settings',
          requiresAuth: true
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: RouteNameConstants.HOME,
      component: HomePage
    },
    ...routes,
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: RouteNameConstants.HOME }
    }
  ]
})

router.beforeEach(async (to, _from, next) => {
  if (to.name === RouteNameConstants.HOME) {
    document.title = config.about.title
  } else {
    document.title = `${to.meta.title} - ${config.about.title}`
  }
  const user = useUser()
  // Attempt to validate the token if not previously done so. This is
  // to ensure the refresh returns you to the same route.
  if (!user.hasValidatedToken) {
    await user.autoLoginIfPossible()
  }
  // If the user is trying to login via twitch
  if (to.hash && to.hash !== '' && !user.isLoggedIn) {
    const authInfo = twitch.login(to.hash)
    if (authInfo !== null) {
      user.login(authInfo)
    }
    next({ name: RouteNameConstants.QUEUE, hash: '' })
    return
    // User is not logged in trying to access auth required route
  } else if (!user.isLoggedIn && to.meta.requiresAuth) {
    next({ name: RouteNameConstants.HOME })
    return
  }
  next()
})

export default router
