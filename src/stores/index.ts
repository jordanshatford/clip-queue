import { useCommands } from './commands'
import { useHistory } from './history'
import { useIntegrations } from './integrations'
import { useQueue } from './queue'
import { useUpcoming } from './upcoming'

/**
 * Initial stores that are related to commands. This ensures that any commands
 * registered by a store are available in the application immediately.
 */
export function initialize(): void {
  const commands = useCommands()
  useHistory()
  useIntegrations()
  useQueue()
  useUpcoming()
  // Filter out commands that not longer exist, i.e. were removed.
  const available = Object.keys(commands.commands)
  commands.settings.enabled = commands.settings.enabled.filter((command) => available.includes(command))
}
