import { Cacheable } from '@/types/cacheable'

import type { IntegrationID } from '../indentify'

/**
 * The format of the player.
 */
export type PlayerFormat = 'iframe' | 'video' | 'unknown'

/**
 * A clip. This represents some item allowed in the queue. In some cases this could be a VOD.
 */
export interface Clip {
  /**
   * The provider of the clip.
   */
  provider: IntegrationID
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
 * The interface of an integration that provides clips. These integrations handle taking a URL and
 * determining if there is content we know how to handle based on it.
 */
export interface IntegrationProvider extends Cacheable<Clip> {
  /**
   * Unique integration ID.
   */
  readonly id: IntegrationID
  /**
   * The display name of the authentication integration. This is used in the UI to represent the integration.
   */
  readonly name: string
  /**
   * Whether the provider is experimental.
   * Experimental providers are providers that are not fully tested and may be unstable.
   */
  readonly isExperimental: boolean
  /**
   * Whether the provider is enabled.
   */
  isEnabled: boolean
  /**
   * Check if this providers supports a given URL.
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
