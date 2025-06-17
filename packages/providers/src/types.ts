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
export abstract class BaseClipProvider {
  /**
   * The name of the provider.
   */
  public abstract name: ClipProvider
  /**
   * The SVG of the provider.
   */
  public abstract svg: string
  /**
   * Whether the provider is experimental.
   */
  public isExperimental = false
  protected cache: Record<string, Clip> = {}
  /**
   * Whether the provider has cached data.
   */
  public get hasCachedData(): boolean {
    return Object.keys(this.cache).length > 0
  }
  /**
   * Clear the cache.
   */
  public clearCache(): void {
    this.cache = {}
  }
  /**
   * Get a clip.
   * @param url - The URL of the clip.
   * @returns The clip or undefined.
   */
  public abstract getClip(url: string): Promise<Clip>
  /**
   * Get the player format.
   * @param clip - The clip.
   * @returns
   */
  public abstract getPlayerFormat(clip: Clip): PlayerFormat
  /**
   * Get the player source.
   * @param clip - The clip.
   * @returns The player source.
   */
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
