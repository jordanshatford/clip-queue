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

export interface IntegrationProvider extends Cacheable<Clip> {
  /**
   * The unique identifier for the authentication integration. This is used to identify the integration in the system and should be unique across all integrations.
   */
  readonly id: string
  /**
   * The display name of the authentication integration. This is used in the UI to represent the integration.
   */
  readonly name: string
  /**
   * The icon representing the authentication integration. This can be a URL to an image or an SVG string.
   */
  readonly icon: string
  /**
   * Whether the provider is experimental.
   * Experimental providers are providers that are not fully tested and may be unstable.
   */
  readonly isExperimental: boolean
  /**
   * Check if this providers supports that URL as a clip URL.
   * @param url - The URL of the clip.
   * @returns true if the provider supports the clip URL, false otherwise.
   */
  hasClipSupport(url: string): boolean
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

export abstract class BaseClipProvider extends Cacheable<Clip> implements IntegrationProvider {
  public abstract readonly id: string
  public abstract readonly name: ClipProvider
  public abstract readonly icon: string
  public readonly isExperimental: boolean = false

  public abstract hasClipSupport(url: string): boolean
  public abstract getClip(url: string): Promise<Clip>
  public abstract getPlayerFormat(clip: Clip): PlayerFormat
  public abstract getPlayerSource(clip: Clip): string
}
