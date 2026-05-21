import type { RouteRecordRaw } from 'vue-router'

/**
 * Sort routes based on meta order.
 * @param a - The first route.
 * @param b - The second route.
 * @returns Number based on the ordering of the two routes.
 */
function compareRoutes(a: RouteRecordRaw, b: RouteRecordRaw): number {
  const aOrder = a.meta?.order ?? Number.MAX_SAFE_INTEGER
  const bOrder = b.meta?.order ?? Number.MAX_SAFE_INTEGER
  return aOrder - bOrder
}

/**
 * Recursively filter and sort routes based on visibility and authentication requirements.
 * @param routes - The array of routes to process.
 * @param isLoggedIn - Whether the user is logged in, used to determine visibility of auth routes.
 * @returns A new array of routes that are visible to the user, sorted by meta order.
 */
export function processRoutes(
  routes: readonly RouteRecordRaw[],
  isLoggedIn?: boolean,
): RouteRecordRaw[] {
  return routes
    .filter((route) => {
      // Do not show hidden routes.
      if (route.meta?.hidden) {
        return false
      }

      // Do not show routes without a name, as they cannot be translated or linked to.
      if (!route.name) {
        return false
      }

      // Do not show routes that require authentication if the user is not logged in.
      if (route.meta?.requiresAuth && !isLoggedIn) {
        return false
      }

      return true
    })
    .map(
      (route): RouteRecordRaw =>
        ({
          ...route,
          children: route.children ? processRoutes(route.children, isLoggedIn) : undefined,
        }) as RouteRecordRaw,
    )
    .toSorted(compareRoutes)
}
