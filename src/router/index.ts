import { computed } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

import { useLogger } from '@/stores/logger'
import { useUser } from '@/stores/user'
declare module 'vue-router' {
  interface RouteMeta {
    icon: string
    requiresAuth: boolean
    title: () => string
    hidden?: boolean
    order?: number
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from) => {
  const logger = useLogger()
  const user = useUser()
  // Attempt to validate the token if not previously done so. This is
  // to ensure the refresh returns you to the same route.
  if (!user.hasAttemptedAutoLogin && !user.isLoggedIn && !(to.name === '/integrations/[id]')) {
    logger.debug('[Router]: Attempting to auto-login user.')
    await user.autoLoginIfPossible()
  }
  // If the user is trying to login via an integration
  if (to.name === '/integrations/[id]' && to.hash !== '' && !user.isLoggedIn) {
    await user.login(to.hash)
    logger.debug(`[Router]: User is logging in via Twitch ${user.details?.name}.`)
    return '/queue'
    // User is not logged in trying to access auth required route
  } else if (!user.isLoggedIn && to.meta.requiresAuth) {
    logger.debug(`[Router]: User is not logged in, redirecting to home page from ${to.fullPath}.`)
    return '/'
  }
  logger.debug(`[Router]: Navigating from ${from.fullPath} to ${to.fullPath}.`)
})

export default router

/**
 * Sort routes based on meta order.
 * @param a - The first route.
 * @param b - The second route.
 * @returns Number based on the ordering of the two routes.
 */
function sortRoutes(a: RouteRecordRaw, b: RouteRecordRaw): number {
  if (!a.meta?.order || !b.meta?.order) {
    return 0
  }
  if (!a.meta?.order) {
    return 1
  }
  if (!b.meta?.order) {
    return -1
  }
  return a.meta.order - b.meta.order
}

/**
 * Deep sort all routes based on the ordering they specified.
 * @param routes - The routes to sort.
 * @returns Array of deeply sorted routes.
 */
function deepSortRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.sort(sortRoutes).map(
    (route) =>
      ({
        ...route,
        children: route.children ? deepSortRoutes(route.children).sort(sortRoutes) : undefined,
      }) as RouteRecordRaw,
  )
}

/**
 * Deep filter all routes based on the ordering they specified.
 * @param routes - The routes to filter.
 * @returns Array of deeply filtered routes.
 */
function deepFilterRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  const user = useUser()
  return routes
    .filter((route) => {
      // Do not show any hidden routes.
      if (route.meta?.hidden) {
        return false
      }
      // Do not show any unnamed routes.
      if (!route.name) {
        return false
      }
      // Do not show any routes that require authentication when the user is logged out.
      return (route.meta?.requiresAuth && user.isLoggedIn) || !route.meta?.requiresAuth
    })
    .map(
      (route) =>
        ({
          ...route,
          children: route.children ? deepFilterRoutes(route.children) : undefined,
        }) as RouteRecordRaw,
    )
}

/**
 * Returns list of allowed routes for the current user.
 */
export const visibleRoutes = computed(() => {
  return deepSortRoutes(deepFilterRoutes(routes))
})
