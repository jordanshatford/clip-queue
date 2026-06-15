/**
 * Attempt to auto-login the integrations app startup. This plugin runs before the main
 * app component is mounted, allowing us to establish the user's authentication state
 * early in the app lifecycle.
 */
export default defineNuxtPlugin(async () => {
  useIntegrations().initialize()
})
