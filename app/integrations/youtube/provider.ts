import type { OEmbedAPI } from '#shared/oembed'

import { isSupportedProviderURL, OEmbedProviderName } from '#shared/oembed'

import type { Clip, PlayerConfig } from '../core'
import type { IntegrationID } from '../indentify'

import { AbstractIntegrationProvider } from '../core'

/**
 * Type of provider available for the YouTube provider.
 */
type YouTubeProviderType = 'short' | 'video'

/**
 * A common YouTube provider that supports 'short' or 'video' as the type.
 */
export class YouTubeProvider extends AbstractIntegrationProvider {
  public constructor(
    id: IntegrationID,
    name: string,
    defaultIsEnabled: boolean,
    private readonly type: YouTubeProviderType,
    private readonly api: OEmbedAPI,
  ) {
    super(id, name, defaultIsEnabled)
  }

  public hasSupportForUrl(url: string): boolean {
    const { type, id } = getYouTubeUrlDetails(url)
    return id !== undefined && type === this.type
  }

  public async resolveUrl(url: string): Promise<Clip> {
    const { id, type, timestamp } = getYouTubeUrlDetails(url)
    if (!id || type !== this.type) {
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
        metadata: this.type === 'video' ? { start: timestamp } : undefined,
      }
    })
  }

  public getPlayerConfigForClip(clip: Clip): PlayerConfig {
    const url = new URL(clip.embedUrl)
    url.searchParams.append('autoplay', '1')
    if (this.type === 'video') {
      // Include timestamp in the player source if available.
      const timestamp = clip.metadata?.['start']
      if (timestamp) {
        url.searchParams.append('start', timestamp)
      }
    }
    return {
      type: 'iframe',
      src: url.toString(),
      title: clip.title,
    }
  }
}

const VIDEO_ALT_HOSTNAME = 'youtu.be'
const SHORT_PATH_SUFFIX = '/shorts/'
const VIDEO_TIMESTAMP_PARAM = 't'
/**
 * Get YouTube URL details.
 * @param url - The URL of the video or short.
 * @returns Information about the URL like ID, timestamp, type.
 */
export function getYouTubeUrlDetails(url: string): {
  type?: YouTubeProviderType
  id?: string
  timestamp?: string
} {
  try {
    const uri = new URL(url)

    // Only accept valid YouTube URLs.
    if (!isSupportedProviderURL(OEmbedProviderName.YOUTUBE, uri)) {
      return {}
    }

    // Verify the URL is either a YouTube video or short URL.
    //  1. https://www.youtube.com/shorts/<ID>
    //  2. https://www.youtube.com/watch?v=<ID>
    //  3. https://www.youtube.com/watch?v=<ID>&t=<TIMESTAMP>
    //  4. https://youtu.be/<ID>
    //  5. https://youtu.be/<ID>?t=<TIMESTAMP>

    // Handle if it is a YouTube short URL.
    if (uri.pathname.includes(SHORT_PATH_SUFFIX)) {
      const segments = uri.pathname.split('/').filter(Boolean)
      if (segments.length < 2) {
        return {}
      }
      const id = segments.pop()
      return { type: 'short', id }
    }

    const timestamp = uri.searchParams.get(VIDEO_TIMESTAMP_PARAM) ?? undefined

    // Handle the different formats of YouTube video URLs.
    if (uri.hostname === VIDEO_ALT_HOSTNAME) {
      const segments = uri.pathname.split('/').filter(Boolean)
      const id = segments.pop()
      return { type: 'video', id, timestamp }
    }

    const id = uri.searchParams.get('v') ?? undefined
    return { type: 'video', id, timestamp }
  } catch {
    return {}
  }
}
