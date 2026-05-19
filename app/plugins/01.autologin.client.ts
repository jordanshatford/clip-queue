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
