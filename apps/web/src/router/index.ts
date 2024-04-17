import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import twitch from '@cq/services/twitch'
import type { MenuItem } from '@cq/ui'
import { config } from '@/config'
import { useUser } from '@/stores/user'
import HomePage from '@/views/HomePage.vue'
import QueuePage from '@/views/QueuePage.vue'
import HistoryPage from '@/views/HistoryPage.vue'
import SettingsPage from '@/views/SettingsPage.vue'
import ChatSettings from '@/views/settings/ChatSettings.vue'
import QueueSettings from '@/views/settings/QueueSettings.vue'
import PreferenceSettings from '@/views/settings/PreferenceSettings.vue'
import OtherSettings from '@/views/settings/OtherSettings.vue'

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
      title: 'Queue',
      requiresAuth: true
    }
  },
  {
    path: '/history',
    name: RouteNameConstants.HISTORY,
    component: HistoryPage,
    meta: {
      icon: 'pi pi-history',
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
      icon: 'pi pi-cog',
      title: 'Settings',
      requiresAuth: true
    },
    children: [
      {
        path: 'chat',
        name: RouteNameConstants.SETTINGS_CHAT,
        component: ChatSettings,
        meta: {
          icon: 'pi pi-comments',
          title: 'Chat Settings',
          requiresAuth: true
        }
      },
      {
        path: 'queue',
        name: RouteNameConstants.SETTINGS_QUEUE,
        component: QueueSettings,
        meta: {
          icon: 'pi pi-list',
          title: 'Queue Settings',
          requiresAuth: true
        }
      },
      {
        path: 'preferences',
        name: RouteNameConstants.SETTINGS_PREFERENCES,
        component: PreferenceSettings,
        meta: {
          icon: 'pi pi-palette',
          title: 'Preferences',
          requiresAuth: true
        }
      },
      {
        path: 'other',
        name: RouteNameConstants.SETTINGS_OTHER,
        component: OtherSettings,
        meta: {
          icon: 'pi pi-cog',
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
      // If it is a settings route 'Other Settings', make the label simply 'Other'
      const isSettingsRoute = r.name?.toString().startsWith('settings_')
      const label = r.meta?.title ? String(r.meta.title) : ''
      return {
        icon: r.meta?.icon ? String(r.meta.icon) : undefined,
        label: isSettingsRoute ? label.replace('Settings', '').trim() : label,
        route: r.children && recursive ? undefined : { name: r.name },
        items: recursive && r.children ? toAllowedMenuItems(r.children, recursive) : undefined
      }
    })
}
