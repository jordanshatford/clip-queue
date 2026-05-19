import { useStorage } from '@vueuse/core'

import type { Clip, IntegrationProvider, PlayerConfig } from '../../core'

import { toStorageKey, Cacheable } from '../../core'
import { IntegrationID } from '../../indentify'
import { getYouTubeOEmbed } from '../core/api'
import { getYouTubeUrlDetails } from '../core/utils'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.YOUTUBE_VIDEOS, 'enabled'), false)

/**
 * Provider for YouTube.com videos.
 */
export class YouTubeVideoProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.YOUTUBE_VIDEOS
  public readonly name: string = 'YouTube Videos'
  public readonly isExperimental: boolean = false

  public get isEnabled(): boolean {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  public hasClipSupport(url: string): boolean {
    const { type, id } = getYouTubeUrlDetails(url)
    return id !== undefined && type === 'video'
  }

  public async getClip(url: string): Promise<Clip> {
    const { id, timestamp } = getYouTubeUrlDetails(url)
    if (!id) {
      throw new Error(`[${this.name}]: Invalid video URL (${url}).`)
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
        channel: oembed?.author_name ?? oembed.provider_name,
        embedUrl: 'https://www.youtube.com/embed',
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
    let src = `${clip.embedUrl}/${clip.id}?autoplay=true`
    // Include timestamp in the player source if available.
    const timestamp = clip.metadata?.['start']
    if (timestamp && typeof timestamp === 'string') {
      src = `${src}&start=${timestamp}`
    }
    return {
      type: 'iframe',
      src: src,
      title: clip.title,
    }
  }
}
