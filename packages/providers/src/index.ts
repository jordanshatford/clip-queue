import type { ClipProviderCtxCallbackMap, ClipProviderMap } from './types'
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

export const providers = {
  all: (cbs: ClipProviderCtxCallbackMap): ClipProviderMap => ({
    [ClipProvider.KICK]: new KickProvider(),
    [ClipProvider.TWITCH]: new TwitchProvider(cbs[ClipProvider.TWITCH]),
    [ClipProvider.YOUTUBE]: new YouTubeProvider()
  })
}
