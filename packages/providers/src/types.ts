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

export type IBaseClipProvider = {
  // Name and svg for display in the UI.
  name: ClipProvider
  svg: string
  // If the provider is experimental and may not work as intended.
  isExperimental: boolean
  // Cache related. We may or may not want to implement caching for each provider.
  hasCachedData: boolean
  clearCache: () => void
  // Functionality used for getting clip information.
  getClip(url: string): Promise<Clip | undefined>
  // Player related. Used to determine how to show the clip.
  getPlayerFormat: (clip: Clip) => PlayerFormat | undefined
  getPlayerSource: (clip: Clip) => string | undefined
}

export abstract class BaseClipProvider implements IBaseClipProvider {
  public abstract name: ClipProvider
  public abstract svg: string

  public isExperimental = false

  protected cache: Record<string, Clip> = {}
  public get hasCachedData(): boolean {
    return Object.keys(this.cache).length > 0
  }
  public clearCache(): void {
    this.cache = {}
  }

  public abstract getClip(url: string): Promise<Clip | undefined>
  public abstract getPlayerFormat(clip: Clip): PlayerFormat | undefined
  public abstract getPlayerSource(clip: Clip): string | undefined
}

export interface ClipProviderCtx {
  id: string
  token?: string
}

export type ClipProviderCtxCallback = () => ClipProviderCtx | Promise<ClipProviderCtx>
