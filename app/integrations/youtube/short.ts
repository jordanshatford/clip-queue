import type { OEmbedAPI } from '#shared/oembed'

import type { Clip, PlayerConfig } from '../core'

import { AbstractIntegrationProvider } from '../core'
import { IntegrationID } from '../indentify'
import { getYouTubeUrlDetails } from './core/utils'

/**
 * Provider for YouTube.com shorts.
 */
export class YouTubeShortProvider extends AbstractIntegrationProvider {
  public constructor(private readonly api: OEmbedAPI) {
    super(IntegrationID.YOUTUBE_SHORTS, 'YouTube Shorts', false)
  }

  public hasSupportForUrl(url: string): boolean {
    const { type, id } = getYouTubeUrlDetails(url)
    return id !== undefined && type === 'short'
  }

  public async resolveUrl(url: string): Promise<Clip> {
    const { id } = getYouTubeUrlDetails(url)
    if (!id) {
      throw new Error(`Invalid URL: ${url}.`)
    }
    return this.cache.cached(id, async (): Promise<Clip> => {
      const oembed = await this.api.getOEmbed(`https://www.youtube.com/watch?v=${id}`)
      return {
        id: id,
        url,
        title: oembed.title ?? '',
        channel: oembed?.author_name ?? this.name,
        embedUrl: `https://www.youtube.com/embed/${id}`,
        thumbnailUrl: oembed.thumbnail_url ?? '',
        provider: this.id,
        submitters: [],
      }
    })
  }

  public getPlayerConfigForClip(clip: Clip): PlayerConfig {
    const url = new URL(clip.embedUrl)
    url.searchParams.append('autoplay', '1')
    return {
      type: 'iframe',
      src: url.toString(),
      title: clip.title,
    }
  }
}
