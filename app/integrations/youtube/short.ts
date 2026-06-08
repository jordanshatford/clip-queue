import type { Clip, PlayerConfig } from '../core'

import { AbstractIntegrationProvider } from '../core'
import { IntegrationID } from '../indentify'
import { getYouTubeOEmbed } from './core/api'
import { getYouTubeUrlDetails } from './core/utils'

/**
 * Provider for YouTube.com shorts.
 */
export class YouTubeShortProvider extends AbstractIntegrationProvider {
  public constructor() {
    super(IntegrationID.YOUTUBE_SHORTS, 'YouTube Shorts', false)
  }

  public hasClipSupport(url: string): boolean {
    const { type, id } = getYouTubeUrlDetails(url)
    return id !== undefined && type === 'short'
  }

  public async getClip(url: string): Promise<Clip> {
    const { id } = getYouTubeUrlDetails(url)
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
      }
    })
  }

  public getPlayerConfig(clip: Clip): PlayerConfig {
    return {
      type: 'iframe',
      src: `${clip.embedUrl}/${clip.id}?autoplay=true`,
      title: clip.title,
    }
  }
}
