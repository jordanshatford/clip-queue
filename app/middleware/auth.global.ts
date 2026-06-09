/**
 * Global authentication middleware for the app. This middleware runs on every route change,
 * allowing us to enforce authentication requirements.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const logger = useLogger()
  const integrations = useIntegrations()

  // Prevent access to routes that require authentication if the user is not logged in.
  if (!integrations.isLoggedIn && to.meta.requiresAuth) {
    logger.debug(`[Middleware]: Unauthenticated user attempted to access ${to.fullPath}.`)
    return navigateTo('/')
  }

  logger.debug(`[Middleware]: Navigating to ${to.fullPath}.`)
})
