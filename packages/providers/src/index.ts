import type { ClipProviderCtxCallback, IBaseClipProvider } from './types'
import { KickProvider } from './kick'
import { TwitchProvider } from './twitch'
import { ClipProvider } from './types'
import { YouTubeProvider } from './youtube'

export * from './clip-list'
export * from './kick'
export * from './twitch'
export * from './types'
export * from './utils'
export * from './youtube'

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
    [ClipProvider.TWITCH]: new TwitchProvider(callbacks[ClipProvider.TWITCH]),
    [ClipProvider.YOUTUBE]: new YouTubeProvider()
  })
}
