/**
 * Initial stores that are related to commands. This ensures that any commands
 * registered by a store are available in the application immediately.
 */
export default defineNuxtPlugin(() => {
  const commands = useCommands()
  useHistory()
  useIntegrations()
  useQueue()
  useUpcoming()
  commands.initialize()
})
