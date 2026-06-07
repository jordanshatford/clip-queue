import { useStorage } from '@vueuse/core'

import type { Clip, IntegrationProvider, PlayerConfig } from '../core'

import { toStorageKey, Cacheable } from '../core'
import { IntegrationID } from '../indentify'
import { getYouTubeOEmbed } from './core/api'
import { getYouTubeUrlDetails } from './core/utils'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.YOUTUBE_VIDEOS, 'enabled'), false)

/**
 * Provider for YouTube.com videos.
 */
export class YouTubeVideoProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.YOUTUBE_VIDEOS
  public readonly name: string = 'YouTube Videos'

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
      throw new Error(`Invalid URL: ${url}.`)
    }
    return this.cached(id, async (): Promise<Clip> => {
      const oembed = await getYouTubeOEmbed(id)
      return {
        id: id,
        url,
        title: oembed.title,
        channel: oembed?.author_name ?? oembed.provider_name,
        embedUrl: 'https://www.youtube.com/embed',
        thumbnailUrl: oembed.thumbnail_url,
        provider: this.id,
        submitters: [],
        metadata: {
          start: timestamp,
        },
      }
    })
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
