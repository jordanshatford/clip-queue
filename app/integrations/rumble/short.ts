import { useStorage } from '@vueuse/core'

import type { Clip, IntegrationProvider, PlayerConfig } from '../core'

import { toStorageKey, Cacheable } from '../core'
import { IntegrationID } from '../indentify'
import { toEmbedUrl } from '../misc/core/utils'
import { getRumbleOEmbed } from './core/api'
import { getRumbleUrlDetails } from './core/utils'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.RUMBLE_SHORTS, 'enabled'), false)

/**
 * Provider for Rumble.com shorts.
 */
export class RumbleShortProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.RUMBLE_SHORTS
  public readonly name: string = 'Rumble Shorts'

  public get isEnabled(): boolean {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  public hasClipSupport(url: string): boolean {
    const { type, id } = getRumbleUrlDetails(url)
    return id !== undefined && type === 'short'
  }

  public async getClip(url: string): Promise<Clip> {
    const { id } = getRumbleUrlDetails(url)
    if (!id) {
      throw new Error(`[${this.name}]: Invalid short URL (${url}).`)
    }
    if (this.cache[id]) {
      return this.cache[id]
    }
    try {
      const oembed = await getRumbleOEmbed(url)
      const response: Clip = {
        id: id,
        url,
        title: oembed.title,
        channel: oembed?.author_name ?? this.name,
        embedUrl: toEmbedUrl(oembed),
        thumbnailUrl: oembed.thumbnail_url,
        provider: this.id,
        submitters: [],
      }
      this.cache[id] = response
      return response
    } catch (error) {
      throw new Error(`[${this.name}]: ${error}`)
    }
  }

  public getPlayerConfig(clip: Clip): PlayerConfig {
    return {
      type: 'iframe',
      src: `${clip.embedUrl}?autoplay=2`,
      title: clip.title,
    }
  }
}
