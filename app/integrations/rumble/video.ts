import { useStorage } from '@vueuse/core'

import type { Clip, IntegrationProvider, PlayerConfig } from '../core'

import { toStorageKey, Cacheable } from '../core'
import { IntegrationID } from '../indentify'
import { getRumbleOEmbed } from './core/api'
import { getRumbleUrlDetails, toEmbedUrl } from './core/utils'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.RUMBLE_VIDEOS, 'enabled'), false)

/**
 * Provider for Rumble.com videos.
 */
export class RumbleVideoProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.RUMBLE_VIDEOS
  public readonly name: string = 'Rumble Videos'

  public get isEnabled(): boolean {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  public hasClipSupport(url: string): boolean {
    const { type, id } = getRumbleUrlDetails(url)
    return id !== undefined && type === 'video'
  }

  public async getClip(url: string): Promise<Clip> {
    const { id, timestamp } = getRumbleUrlDetails(url)
    if (!id) {
      throw new Error(`[${this.name}]: Invalid video URL (${url}).`)
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
        category: 'Video',
        provider: this.id,
        submitters: [],
        metadata: {
          start: timestamp,
        },
      }
      this.cache[id] = response
      return response
    } catch (error) {
      throw new Error(`[${this.name}]: ${error}`)
    }
  }

  public getPlayerConfig(clip: Clip): PlayerConfig {
    let src = `${clip.embedUrl}?autoplay=2`
    const timestamp = clip.metadata?.['start']
    if (timestamp && typeof timestamp === 'string') {
      src = `${src}&start=${timestamp}`
    }
    return {
      type: 'iframe',
      src,
      title: clip.title,
    }
  }
}
