/**
 * Enumeration of clip providers.
 */
export enum ClipProvider {
  /**
   * Kick.com clips.
   */
  KICK = 'Kick',
  /**
   * Twitch.tv clips.
   */
  TWITCH = 'Twitch'
}

/**
 * The format of the player.
 */
export type PlayerFormat = 'iframe' | 'video' | 'unknown'

/**
 * A clip.
 */
export interface Clip {
  /**
   * The provider of the clip.
   */
  provider: ClipProvider
  /**
   * The ID of the clip.
   */
  id: string
  /**
   * The URL of the clip.
   */
  url: string
  /**
   * The embed URL of the clip.
   */
  embedUrl: string
  /**
   * The thumbnail URL of the clip.
   */
  thumbnailUrl: string
  /**
   * The title of the clip.
   */
  title: string
  /**
   * The channel of the clip.
   */
  channel: string
  /**
   * The creator of the clip.
   */
  creator: string
  /**
   * The submitters of the clip.
   */
  submitters: string[]
  /**
   * The category of the clip.
   */
  category?: string
  /**
   * The created at time of the clip.
   */
  createdAt?: string
}

/**
 * The base clip provider.
 */
export type IBaseClipProvider = {
  /**
   * The name of the provider.
   */
  name: ClipProvider
  /**
   * The SVG of the provider.
   */
  svg: string
  /**
   * Whether the provider is experimental.
   */
  isExperimental: boolean
  /**
   * Whether the provider has cached data.
   */
  hasCachedData: boolean
  /**
   * Clear the cache.
   */
  clearCache: () => void
  /**
   * Get a clip.
   * @param url - The URL of the clip.
   * @returns The clip or undefined.
   */
  getClip(url: string): Promise<Clip | undefined>
  /**
   * Get the player format.
   * @param clip - The clip.
   * @returns
   */
  getPlayerFormat: (clip: Clip) => PlayerFormat | undefined
  /**
   * Get the player source.
   * @param clip - The clip.
   * @returns The player source.
   */
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
  public abstract getPlayerFormat(clip: Clip): PlayerFormat
  public abstract getPlayerSource(clip: Clip): string
}

/**
 * Clip provider context.
 */
export interface ClipProviderCtx {
  /**
   * The ID of the user.
   */
  id: string
  /**
   * The token of the user.
   */
  token?: string
}

/**
 * Clip provider context callback.
 */
export type ClipProviderCtxCallback = () => ClipProviderCtx | Promise<ClipProviderCtx>
