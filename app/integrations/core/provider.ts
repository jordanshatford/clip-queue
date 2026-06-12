import type { RemovableRef } from '@vueuse/core'
import type { Reactive } from 'vue'

import { useStorage } from '@vueuse/core'

import { CacheMap } from '#shared/utils'

import type { IntegrationID } from '../indentify'

import { toStorageKey } from './utils'

/**
 * The configuration of the player.
 */
export type PlayerConfig =
  | { type: 'iframe'; src: string; title?: string }
  | { type: 'video'; src: string; poster?: string; title?: string; start?: number }

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
  /**
   * Additional details a provider can add to the clip.
   */
  metadata?: Record<string, string | undefined>
}

/**
 * Interface for an integrations provider.
 */
export interface IntegrationProvider {
  /**
   * The ID of the integration provider.
   */
  readonly id: IntegrationID
  /**
   * The display name used by the application for the integration provider.
   */
  readonly name: string
  /**
   * If the integration provider is enabled.
   */
  isEnabled: boolean
  /**
   * If the integration provider is misconfigured.
   */
  readonly isMisconfigured: boolean
  /**
   * Whether the provider has any cached data.
   * @returns True if there is cached data, false otherwise.
   */
  hasCachedData: boolean
  /**
   * Clear the providers cached data.
   */
  clearCache(): void
  /**
   * Check if the integration provider supports a given URL.
   * @param url - The URL.
   * @returns true if the integration provider supports the URL, false otherwise.
   */
  hasSupportForUrl(url: string): boolean
  /**
   * Resolve a URL into details for a clip.
   * @param url - The URL.
   * @returns The clip for the URL.
   * @throws An error if the URL is invalid or the clip cannot be retrieved.
   */
  resolveUrl(url: string): Promise<Clip>
  /**
   * Get the player configuration for a clip.
   * @param clip - The clip to get the player config for.
   * @returns The player config.
   * @throws An error if the player config cannot be retrieved.
   */
  getPlayerConfigForClip(clip: Clip): PlayerConfig
}

/**
 * Abstract class for an integration provider. These take a URL and determine if they can provide
 * clip details and playback configuration for it. They can be enabled and disabled as the user pleases.
 */
export abstract class AbstractIntegrationProvider implements IntegrationProvider {
  protected constructor(
    /**
     * The ID of the integration provider.
     */
    public readonly id: IntegrationID,
    /**
     * The display name used by the application for the integration provider.
     */
    public readonly name: string,
    /**
     * The default value for if the integration provider isEnabled.
     */
    defaultIsEnabled: boolean,
  ) {
    this.state = reactive({
      isEnabled: useStorage<boolean>(toStorageKey(id, 'enabled'), defaultIsEnabled),
    })
  }

  protected state: Reactive<{ isEnabled: RemovableRef<boolean> }>

  public get isEnabled(): boolean {
    return this.state.isEnabled
  }

  public set isEnabled(value: boolean) {
    this.state.isEnabled = value
  }
  public get isMisconfigured(): boolean {
    return false
  }

  protected cache: CacheMap<Clip> = new CacheMap()

  public get hasCachedData(): boolean {
    return this.cache.size > 0
  }

  public clearCache(): void {
    this.cache.clear()
  }

  public abstract hasSupportForUrl(url: string): boolean
  public abstract resolveUrl(url: string): Promise<Clip>
  public abstract getPlayerConfigForClip(clip: Clip): PlayerConfig
}
