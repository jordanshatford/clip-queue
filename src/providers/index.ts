import type { IntegrationProvider } from '@/integrations'

import { ClipProvider } from '@/integrations'
import { clips as kickClips } from '@/integrations/kick'
import { clips as twitchClips } from '@/integrations/twitch'

/**
 * The providers.
 */
export const providers = {
  /**
   * Get all providers.
   * @param callbacks - The callbacks.
   * @returns The providers.
   */
  all: (): Record<ClipProvider, IntegrationProvider> => ({
    [ClipProvider.KICK]: kickClips,
    [ClipProvider.TWITCH]: twitchClips,
  }),
}
