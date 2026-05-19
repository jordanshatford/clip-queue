/**
 * Attempt to auto-login the user on app startup. This plugin runs before the main
 * app component is mounted, allowing us to establish the user's authentication
 * state early in the app lifecycle.
 */
export default defineNuxtPlugin(async () => {
  const logger = useLogger()
  const user = useUser()

  // Prevent duplicate initialization during HMR/navigation
  if (user.hasAttemptedAutoLogin) {
    return
  }

  logger.debug('[Auth]: Attempting auto-login.')

  try {
    await user.autoLoginIfPossible()
    if (user.isLoggedIn) {
      logger.debug(`[Auth]: Logged in as ${user.details?.name}.`)
    } else {
      logger.debug('[Auth]: No existing session found.')
    }
  } catch (error) {
    logger.error(`[Auth]: Auto-login failed. ${error}`)
  } finally {
    user.hasAttemptedAutoLogin = true
  }
})
