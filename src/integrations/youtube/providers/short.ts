import { useStorage } from '@vueuse/core'

import type { Clip, IntegrationProvider, PlayerConfig } from '../../core'

import { toStorageKey, Cacheable } from '../../core'
import { IntegrationID } from '../../indentify'
import { getYouTubeOEmbed } from '../core/api'
import { getYouTubeUrlDetails } from '../core/utils'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.YOUTUBE_SHORTS, 'enabled'), false)

/**
 * Provider for YouTube.com shorts.
 */
export class YouTubeShortProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.YOUTUBE_SHORTS
  public readonly name: string = 'YouTube Shorts'
  public readonly isExperimental: boolean = false

  public get isEnabled(): boolean {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  public hasClipSupport(url: string): boolean {
    const { type, id } = getYouTubeUrlDetails(url)
    return id !== undefined && type === 'short'
  }

  public async getClip(url: string): Promise<Clip> {
    const { id } = getYouTubeUrlDetails(url)
    if (!id) {
      throw new Error(`[${this.name}]: Invalid short URL (${url}).`)
    }
    if (this.cache[id]) {
      return this.cache[id]
    }
    try {
      const oembed = await getYouTubeOEmbed(id)
      const response: Clip = {
        id: id,
        url,
        title: oembed.title,
        channel: oembed.author_name,
        embedUrl: 'https://www.youtube.com/embed',
        thumbnailUrl: oembed.thumbnail_url,
        category: 'Short',
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
      src: `${clip.embedUrl}/${clip.id}?autoplay=true`,
      title: clip.title,
    }
  }
}
