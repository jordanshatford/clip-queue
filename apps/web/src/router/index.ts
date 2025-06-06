import type { RouteRecordRaw } from 'vue-router'
import { computed } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import { config } from '@/config'
import * as m from '@/paraglide/messages'
import { useLogger } from '@/stores/logger'
import { useUser } from '@/stores/user'
import HistoryPage from '@/views/HistoryPage.vue'
import HomePage from '@/views/HomePage.vue'
import LogsPage from '@/views/LogsPage.vue'
import QueuePage from '@/views/QueuePage.vue'
import ChatSettings from '@/views/settings/ChatSettings.vue'
import LoggerSettings from '@/views/settings/LoggerSettings.vue'
import OtherSettings from '@/views/settings/OtherSettings.vue'
import PreferenceSettings from '@/views/settings/PreferenceSettings.vue'
import QueueSettings from '@/views/settings/QueueSettings.vue'

declare module 'vue-router' {
  interface RouteMeta {
    icon: string
    requiresAuth: boolean
  }
}

export enum RouteNameConstants {
  HOME = 'home',
  QUEUE = 'queue',
  HISTORY = 'history',
  LOGS = 'logs',
  SETTINGS = 'settings',
  SETTINGS_CHAT = 'settings_chat',
  SETTINGS_QUEUE = 'settings_queue',
  SETTINGS_PREFERENCES = 'settings_preferences',
  SETTINGS_LOGS = 'settings_logs',
  SETTINGS_OTHER = 'settings_other'
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/queue',
    name: RouteNameConstants.QUEUE,
    component: QueuePage,
    meta: {
      icon: 'pi pi-list',
      requiresAuth: true
    }
  },
  {
    path: '/history',
    name: RouteNameConstants.HISTORY,
    component: HistoryPage,
    meta: {
      icon: 'pi pi-history',
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: RouteNameConstants.SETTINGS,
    redirect: { name: RouteNameConstants.SETTINGS_CHAT },
    component: () => import('@/views/SettingsPage.vue'),
    meta: {
      icon: 'pi pi-cog',
      requiresAuth: true
    },
    children: [
      {
        path: 'chat',
        name: RouteNameConstants.SETTINGS_CHAT,
        component: ChatSettings,
        meta: {
          icon: 'pi pi-comments',
          requiresAuth: true
        }
      },
      {
        path: 'queue',
        name: RouteNameConstants.SETTINGS_QUEUE,
        component: QueueSettings,
        meta: {
          icon: 'pi pi-list',
          requiresAuth: true
        }
      },
      {
        path: 'preferences',
        name: RouteNameConstants.SETTINGS_PREFERENCES,
        component: PreferenceSettings,
        meta: {
          icon: 'pi pi-palette',
          requiresAuth: true
        }
      },
      {
        path: 'logs',
        name: RouteNameConstants.SETTINGS_LOGS,
        component: LoggerSettings,
        meta: {
          icon: 'pi pi-book',
          requiresAuth: true
        }
      },
      {
        path: 'other',
        name: RouteNameConstants.SETTINGS_OTHER,
        component: OtherSettings,
        meta: {
          icon: 'pi pi-cog',
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
    {
      path: '/logs',
      name: RouteNameConstants.LOGS,
      component: LogsPage,
      meta: {
        icon: 'pi pi-book',
        requiresAuth: true
      }
    },
    ...routes,
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: RouteNameConstants.HOME }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  document.title = config.title
  const logger = useLogger()
  const user = useUser()
  // Attempt to validate the token if not previously done so. This is
  // to ensure the refresh returns you to the same route.
  if (!user.hasValidatedToken && !user.isLoggedIn) {
    logger.debug('[Router]: Attempting to auto-login user.')
    await user.autoLoginIfPossible()
  }
  // If the user is trying to login via twitch
  if (to.hash && to.hash !== '' && !user.isLoggedIn) {
    user.login(to.hash)
    logger.debug(`[Router]: User is logging in via Twitch ${user.ctx.username}.`)
    next({ name: RouteNameConstants.QUEUE, hash: '' })
    return
    // User is not logged in trying to access auth required route
  } else if (!user.isLoggedIn && to.meta.requiresAuth) {
    logger.debug(`[Router]: User is not logged in, redirecting to home page from ${to.fullPath}.`)
    next({ name: RouteNameConstants.HOME })
    return
  }
  logger.debug(`[Router]: Navigating from ${from.fullPath} to ${to.fullPath}.`)
  next()
})

export default router

// Translations for each of the routes.
export const routeTranslations = {
  [RouteNameConstants.HOME]: () => '',
  [RouteNameConstants.QUEUE]: m.queue,
  [RouteNameConstants.HISTORY]: m.history,
  [RouteNameConstants.LOGS]: m.logs,
  [RouteNameConstants.SETTINGS]: m.settings,
  [RouteNameConstants.SETTINGS_CHAT]: m.settings_chat,
  [RouteNameConstants.SETTINGS_QUEUE]: m.settings_queue,
  [RouteNameConstants.SETTINGS_PREFERENCES]: m.settings_preferences,
  [RouteNameConstants.SETTINGS_LOGS]: m.logs,
  [RouteNameConstants.SETTINGS_OTHER]: m.settings_other
}

/**
 * Returns list of allowed routes for the current user.
 */
export const allowedRoutes = computed(() => {
  const user = useUser()
  return routes.filter((r) => (r.meta?.requiresAuth && user.isLoggedIn) || !r.meta?.requiresAuth)
})
