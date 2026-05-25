/**
 * Global authentication middleware for the app. This middleware runs on every route change,
 * allowing us to enforce authentication requirements and handle special login flows (like
 * Twitch integration) in a centralized place.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const logger = useLogger()
  const user = useUser()

  // Handle integration login flow with callback and hash.
  if (to.name === 'integrations-id' && !user.isLoggedIn) {
    await user.login(to.fullPath)
    logger.debug(`[Router]: User logged in via Twitch ${user.details?.name}.`)
    return navigateTo('/queue')
  }

  // Prevent access to routes that require authentication if the user is not logged in.
  if (!user.isLoggedIn && to.meta.requiresAuth) {
    logger.debug(`[Router]: Not logged in, redirecting from ${to.fullPath}.`)
    return navigateTo('/')
  }

  logger.debug(`[Router]: Navigating to ${to.fullPath}.`)
})
