import { Cacheable } from '@/types/cacheable'

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
  TWITCH = 'Twitch',
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

export interface IClipProvider extends Cacheable<Clip> {
  /**
   * The name of the provider.
   */
  readonly name: ClipProvider
  /**
   * The SVG of the provider.
   */
  readonly svg: string
  /**
   * Whether the provider is experimental.
   * Experimental providers are providers that are not fully tested and may be unstable.
   */
  readonly isExperimental: boolean
  /**
   * Get a clip from a URL.
   * @param url - The URL of the clip.
   * @returns The clip.
   * @throws An error if the URL is invalid or the clip cannot be retrieved.
   */
  getClip(url: string): Promise<Clip>
  /**
   * Get the player format for a clip.
   * @param clip - The clip to get the player format for.
   * @returns The player format.
   */
  getPlayerFormat(clip: Clip): PlayerFormat
  /**
   * Get the player source for a clip.
   * @param clip - The clip to get the player source for.
   * @returns The player source.
   * @throws An error if the player source cannot be retrieved.
   */
  getPlayerSource(clip: Clip): string
}

/**
 * The base clip provider.
 */
export abstract class BaseClipProvider extends Cacheable<Clip> {
  /**
   * The name of the provider.
   */
  public abstract readonly name: ClipProvider
  /**
   * The SVG of the provider.
   */
  public abstract readonly svg: string
  /**
   * Whether the provider is experimental.
   */
  public get isExperimental(): boolean {
    return false
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
 * Clip provider context callback.
 */
export type ClipProviderCtxCallback = () => string | Promise<string>
