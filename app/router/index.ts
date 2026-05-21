import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    icon: string
    requiresAuth: boolean
    hidden?: boolean
    order?: number
  }
}

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
  const router = useRouter()
  return deepSortRoutes(deepFilterRoutes([...router.options.routes]))
})
