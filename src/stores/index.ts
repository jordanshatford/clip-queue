import { useCommands } from './commands'
import { useHistory } from './history'
import { useProviders } from './providers'
import { useQueue } from './queue'
import { useSources } from './sources'
import { useUpcoming } from './upcoming'

/**
 * Initial stores that are related to commands. This ensures that any commands
 * registered by a store are available in the application immediately.
 */
export function initialize(): void {
  useCommands()
  useHistory()
  useProviders()
  useQueue()
  useSources()
  useUpcoming()
}
