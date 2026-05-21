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
  // Filter out commands that not longer exist, i.e. commands that have been removed.
  const available = Object.keys(commands.commands)
  commands.settings.enabled = commands.settings.enabled.filter((command) =>
    available.includes(command),
  )
})
