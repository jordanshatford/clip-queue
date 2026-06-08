import type { Clip, PlayerConfig } from '../core'

import { AbstractIntegrationProvider } from '../core'
import { IntegrationID } from '../indentify'
import { getYouTubeOEmbed } from './core/api'
import { getYouTubeUrlDetails } from './core/utils'

/**
 * Provider for YouTube.com videos.
 */
export class YouTubeVideoProvider extends AbstractIntegrationProvider {
  public constructor() {
    super(IntegrationID.YOUTUBE_VIDEOS, 'YouTube Videos', false)
  }

  public hasSupportForUrl(url: string): boolean {
    const { type, id } = getYouTubeUrlDetails(url)
    return id !== undefined && type === 'video'
  }

  public async resolveUrl(url: string): Promise<Clip> {
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
        embedUrl: `https://www.youtube.com/embed/${id}`,
        thumbnailUrl: oembed.thumbnail_url,
        provider: this.id,
        submitters: [],
        metadata: {
          start: timestamp,
        },
      }
    })
  }

  public getPlayerConfigForClip(clip: Clip): PlayerConfig {
    const url = new URL(clip.embedUrl)
    url.searchParams.append('autoplay', '1')
    // Include timestamp in the player source if available.
    const timestamp = clip.metadata?.['start']
    if (timestamp && typeof timestamp === 'string') {
      url.searchParams.append('start', timestamp)
    }
    return {
      type: 'iframe',
      src: url.toString(),
      title: clip.title,
    }
  }
}
