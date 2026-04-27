import type { BaseClipProvider } from '@/integrations'

import { ClipProvider } from '@/integrations'
import { clips as twitchClips } from '@/integrations/twitch'

import { KickProvider } from './kick'

export * from './clip-list'
export * from './kick'
export * from './utils'

/**
 * The providers.
 */
export const providers = {
  /**
   * Get all providers.
   * @param callbacks - The callbacks.
   * @returns The providers.
   */
  all: (): Record<ClipProvider, BaseClipProvider> => ({
    [ClipProvider.KICK]: new KickProvider(),
    [ClipProvider.TWITCH]: twitchClips,
  }),
}
