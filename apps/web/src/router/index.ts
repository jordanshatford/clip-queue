import type { ComputedRef } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { computed } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import type { MenuItem } from '@cq/ui'
import twitch from '@cq/services/twitch'

import { config } from '@/config'
import * as m from '@/paraglide/messages'
import { useUser } from '@/stores/user'
import HistoryPage from '@/views/HistoryPage.vue'
import HomePage from '@/views/HomePage.vue'
import QueuePage from '@/views/QueuePage.vue'
import ChatSettings from '@/views/settings/ChatSettings.vue'
import OtherSettings from '@/views/settings/OtherSettings.vue'
import PreferenceSettings from '@/views/settings/PreferenceSettings.vue'
import QueueSettings from '@/views/settings/QueueSettings.vue'
import SettingsPage from '@/views/SettingsPage.vue'

export enum RouteNameConstants {
  HOME = 'home',
  QUEUE = 'queue',
  HISTORY = 'history',
  SETTINGS = 'settings',
  SETTINGS_CHAT = 'settings_chat',
  SETTINGS_QUEUE = 'settings_queue',
  SETTINGS_PREFERENCES = 'settings_preferences',
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
    component: SettingsPage,
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
    ...routes,
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: RouteNameConstants.HOME }
    }
  ]
})

router.beforeEach(async (to, _from, next) => {
  document.title = config.title
  const user = useUser()
  // Attempt to validate the token if not previously done so. This is
  // to ensure the refresh returns you to the same route.
  if (!user.hasValidatedToken && !user.isLoggedIn) {
    await user.autoLoginIfPossible()
  }
  // If the user is trying to login via twitch
  if (to.hash && to.hash !== '' && !user.isLoggedIn) {
    const authInfo = twitch.login(to.hash)
    if (authInfo !== null) {
      try {
        await user.login(authInfo)
      } catch (e) {
        console.error('Failed to login to Twitch: ', e)
      }
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

export const routeNameTranslations: ComputedRef<Record<RouteNameConstants, string>> = computed(
  () => ({
    [RouteNameConstants.HOME]: '',
    [RouteNameConstants.QUEUE]: m.queue(),
    [RouteNameConstants.HISTORY]: m.history(),
    [RouteNameConstants.SETTINGS]: m.settings(),
    [RouteNameConstants.SETTINGS_CHAT]: m.settings_chat(),
    [RouteNameConstants.SETTINGS_QUEUE]: m.settings_queue(),
    [RouteNameConstants.SETTINGS_PREFERENCES]: m.settings_preferences(),
    [RouteNameConstants.SETTINGS_OTHER]: m.settings_other()
  })
)

/**
 * Convert list of routes to MenuItem used by UI. These are authorized routes only.
 * @param routes - the routes to use.
 * @param recursive - if children routes should be included.
 * @returns MenuItem[]
 */
export function toAllowedMenuItems(
  routes: RouteRecordRaw[],
  recursive: boolean = false
): MenuItem[] {
  const user = useUser()
  return routes
    .filter((r) => (r.meta?.requiresAuth && user.isLoggedIn) || !r.meta?.requiresAuth)
    .map((r) => {
      return {
        icon: r.meta?.icon ? String(r.meta.icon) : undefined,
        label: r?.name ? routeNameTranslations.value[r.name as RouteNameConstants] : '',
        route: r.children && recursive ? undefined : { name: r.name },
        items: recursive && r.children ? toAllowedMenuItems(r.children, recursive) : undefined
      }
    })
}
