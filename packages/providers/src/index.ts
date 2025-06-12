import type { ClipProviderCtxCallback, IBaseClipProvider } from './types'
import { KickProvider } from './kick'
import { TwitchProvider } from './twitch'
import { ClipProvider } from './types'

export * from './clip-list'
export * from './kick'
export * from './twitch'
export * from './types'
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
  all: (
    callbacks: Partial<Record<ClipProvider, ClipProviderCtxCallback>>
  ): Record<ClipProvider, IBaseClipProvider> => ({
    [ClipProvider.KICK]: new KickProvider(),
    [ClipProvider.TWITCH]: new TwitchProvider(callbacks[ClipProvider.TWITCH])
  })
}
