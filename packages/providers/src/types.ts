export enum ClipProvider {
  KICK = 'Kick',
  TWITCH = 'Twitch',
  YOUTUBE = 'YouTube'
}

export type PlayerFormat = 'iframe' | 'video' | 'unknown'

export interface Clip {
  provider: ClipProvider
  submitters: string[]
  id: string
  title?: string
  channel?: string
  category?: string
  createdAt?: string
  url?: string
  embedUrl?: string
  thumbnailUrl?: string
}

export interface IClipProvider {
  // Name and svg for display in the UI.
  name: ClipProvider
  svg?: string
  // If the provider is experimental and may not work as intended.
  isExperimental?: boolean
  // Cache related. We may or may not want to implement caching for each provider.
  hasCachedData?: boolean
  clearCache?: () => void
  // Functionality used for getting clip information.
  getClip(url: string): Promise<Clip | undefined>
  // Player related. Used to determine how to show the clip.
  getPlayerFormat: (clip: Clip) => PlayerFormat | undefined
  getPlayerSource: (clip: Clip) => string | undefined
}

export interface ClipProviderCtx {
  id: string
  token?: string
}

export type ClipProviderCtxCallback = () => ClipProviderCtx | Promise<ClipProviderCtx>

export type ClipProviderMap = Partial<Record<ClipProvider, IClipProvider>>

export type ClipProviderCtxCallbackMap = Partial<Record<ClipProvider, ClipProviderCtxCallback>>
