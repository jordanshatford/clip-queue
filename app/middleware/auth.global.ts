import type { IntegrationID } from '~/integrations'

/**
 * Global authentication middleware for the app. This middleware runs on every route change,
 * allowing us to enforce authentication requirements and handle special login flows (like
 * Twitch integration) in a centralized place.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const logger = useLogger()
  const integrations = useIntegrations()

  // Handle integration login based on the ID of the integration.
  if (to.name === 'integrations-id') {
    const id = to.params.id as IntegrationID
    if (!integrations.isLoggedInTo(id)) {
      await integrations.login(id, to.fullPath)
      logger.debug(`[Router]: User logged in using integration ${id}`)
      return navigateTo('/queue')
    }
  }

  // Prevent access to routes that require authentication if the user is not logged in.
  if (!integrations.isLoggedIn && to.meta.requiresAuth) {
    logger.debug(`[Router]: Not logged in, redirecting from ${to.fullPath}.`)
    return navigateTo('/')
  }

  logger.debug(`[Router]: Navigating to ${to.fullPath}.`)
})
