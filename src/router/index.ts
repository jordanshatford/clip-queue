import type { RouteRecordRaw } from 'vue-router'

import { computed } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import { config } from '@/config'
import { m } from '@/paraglide/messages'
import { useLogger } from '@/stores/logger'
import { useUser } from '@/stores/user'
declare module 'vue-router' {
  interface RouteMeta {
    icon: string
    requiresAuth: boolean
  }
}

export enum RouteNameConstants {
  INTEGRATIONS = 'integrations',
  HOME = 'home',
  QUEUE = 'queue',
  HISTORY = 'history',
  LOGS = 'logs',
  SETTINGS = 'settings',
  SETTINGS_CHAT = 'settings_chat',
  SETTINGS_QUEUE = 'settings_queue',
  SETTINGS_INTEGRATIONS = 'settings_integrations',
  SETTINGS_PREFERENCES = 'settings_preferences',
  SETTINGS_LOGS = 'settings_logs',
  SETTINGS_OTHER = 'settings_other',
}

const integrationRoutes: RouteRecordRaw[] = [
  {
    path: '/integrations/:id',
    name: RouteNameConstants.INTEGRATIONS,
    component: () => import('@/views/IntegrationsPage.vue'),
  },
]

export const routes: RouteRecordRaw[] = [
  {
    path: '/queue',
    name: RouteNameConstants.QUEUE,
    component: () => import('@/views/QueuePage.vue'),
    meta: {
      icon: 'pi pi-list',
      requiresAuth: true,
    },
  },
  {
    path: '/history',
    name: RouteNameConstants.HISTORY,
    component: () => import('@/views/HistoryPage.vue'),
    meta: {
      icon: 'pi pi-history',
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: RouteNameConstants.SETTINGS,
    redirect: { name: RouteNameConstants.SETTINGS_CHAT },
    component: () => import('@/views/SettingsPage.vue'),
    meta: {
      icon: 'pi pi-cog',
      requiresAuth: true,
    },
    children: [
      {
        path: 'chat',
        name: RouteNameConstants.SETTINGS_CHAT,
        component: () => import('@/views/settings/ChatSettings.vue'),
        meta: {
          icon: 'pi pi-comments',
          requiresAuth: true,
        },
      },
      {
        path: 'queue',
        name: RouteNameConstants.SETTINGS_QUEUE,
        component: () => import('@/views/settings/QueueSettings.vue'),
        meta: {
          icon: 'pi pi-list',
          requiresAuth: true,
        },
      },
      {
        path: 'integrations',
        name: RouteNameConstants.SETTINGS_INTEGRATIONS,
        component: () => import('@/views/settings/IntegrationSettings.vue'),
        meta: {
          icon: 'pi pi-share-alt',
          requiresAuth: true,
        },
      },
      {
        path: 'preferences',
        name: RouteNameConstants.SETTINGS_PREFERENCES,
        component: () => import('@/views/settings/PreferenceSettings.vue'),
        meta: {
          icon: 'pi pi-palette',
          requiresAuth: true,
        },
      },
      {
        path: 'logs',
        name: RouteNameConstants.SETTINGS_LOGS,
        component: () => import('@/views/settings/LoggerSettings.vue'),
        meta: {
          icon: 'pi pi-book',
          requiresAuth: true,
        },
      },
      {
        path: 'other',
        name: RouteNameConstants.SETTINGS_OTHER,
        component: () => import('@/views/settings/OtherSettings.vue'),
        meta: {
          icon: 'pi pi-cog',
          requiresAuth: true,
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteNameConstants.HOME,
      component: () => import('@/views/HomePage.vue'),
    },
    {
      path: '/logs',
      name: RouteNameConstants.LOGS,
      component: () => import('@/views/LogsPage.vue'),
      meta: {
        icon: 'pi pi-book',
        requiresAuth: true,
      },
    },
    ...routes,
    ...integrationRoutes,
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: RouteNameConstants.HOME },
    },
  ],
})

router.beforeEach(async (to, from) => {
  document.title = config.title
  const logger = useLogger()
  const user = useUser()
  // Attempt to validate the token if not previously done so. This is
  // to ensure the refresh returns you to the same route.
  if (
    !user.hasAttemptedAutoLogin &&
    !user.isLoggedIn &&
    !(to.name === RouteNameConstants.INTEGRATIONS)
  ) {
    logger.debug('[Router]: Attempting to auto-login user.')
    await user.autoLoginIfPossible()
  }
  // If the user is trying to login via an integration
  if (to.name === RouteNameConstants.INTEGRATIONS && to.hash !== '' && !user.isLoggedIn) {
    await user.login(to.hash)
    logger.debug(`[Router]: User is logging in via Twitch ${user.details?.name}.`)
    return { name: RouteNameConstants.QUEUE, hash: '' }
    // User is not logged in trying to access auth required route
  } else if (!user.isLoggedIn && to.meta.requiresAuth) {
    logger.debug(`[Router]: User is not logged in, redirecting to home page from ${to.fullPath}.`)
    return { name: RouteNameConstants.HOME }
  }
  logger.debug(`[Router]: Navigating from ${from.fullPath} to ${to.fullPath}.`)
})

export default router

// Translations for each of the routes.
export const routeTranslations = {
  [RouteNameConstants.INTEGRATIONS]: () => '',
  [RouteNameConstants.HOME]: () => '',
  [RouteNameConstants.QUEUE]: m.queue,
  [RouteNameConstants.HISTORY]: m.history,
  [RouteNameConstants.LOGS]: m.logs,
  [RouteNameConstants.SETTINGS]: m.settings,
  [RouteNameConstants.SETTINGS_CHAT]: m.settings_chat,
  [RouteNameConstants.SETTINGS_QUEUE]: m.settings_queue,
  [RouteNameConstants.SETTINGS_INTEGRATIONS]: () => 'Integrations',
  [RouteNameConstants.SETTINGS_PREFERENCES]: m.settings_preferences,
  [RouteNameConstants.SETTINGS_LOGS]: m.logs,
  [RouteNameConstants.SETTINGS_OTHER]: m.settings_other,
}

/**
 * Returns list of allowed routes for the current user.
 */
export const allowedRoutes = computed(() => {
  const user = useUser()
  return routes.filter((r) => (r.meta?.requiresAuth && user.isLoggedIn) || !r.meta?.requiresAuth)
})
