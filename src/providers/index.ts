export * from './common'
export * from './kick'
export * from './twitch'
export * from './youtube'

import { KickProvider } from './kick'
import { TwitchProvider } from './twitch'
import { YouTubeProvider } from './youtube'
import { ClipProvider, type IClipProvider } from './common'

export interface ClipProviderCtx {
  id: string
  token?: string
}

export type ClipProviderCtxCallback = () => ClipProviderCtx

export type ClipProviderMap = Partial<Record<ClipProvider, IClipProvider>>

export type ClipProviderCtxCallbackMap = Partial<Record<ClipProvider, ClipProviderCtxCallback>>

export const providers = {
  all: (cbs: ClipProviderCtxCallbackMap): ClipProviderMap => ({
    [ClipProvider.KICK]: new KickProvider(),
    [ClipProvider.TWITCH]: new TwitchProvider(cbs[ClipProvider.TWITCH]),
    [ClipProvider.YOUTUBE]: new YouTubeProvider()
  })
}
