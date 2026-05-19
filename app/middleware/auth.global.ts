/**
 * Global authentication middleware for the app. This middleware runs on every route change,
 * allowing us to enforce authentication requirements and handle special login flows (like
 * Twitch integration) in a centralized place.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const logger = useLogger()
  const user = useUser()

  // Integration login flow
  if (to.name === 'integrations-id' && to.hash && !user.isLoggedIn) {
    await user.login(to.hash)
    logger.debug(`[Router]: User logged in via Twitch ${user.details?.name}.`)
    return navigateTo('/queue')
  }

  // Auth protection
  if (!user.isLoggedIn && to.meta.requiresAuth) {
    logger.debug(`[Router]: Not logged in, redirecting from ${to.fullPath}.`)
    return navigateTo('/')
  }

  logger.debug(`[Router]: Navigating to ${to.fullPath}.`)
})
