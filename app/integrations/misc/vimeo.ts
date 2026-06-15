import type { OEmbedAPI } from '#shared/oembed'

import { isSupportedProviderURL, OEmbedProviderName } from '#shared/oembed'

import type { Clip, PlayerConfig } from '../core'

import { AbstractIntegrationProvider } from '../core'
import { IntegrationID } from '../indentify'

/**
 * Provider for Vimeo.com content.
 */
export class VimeoProvider extends AbstractIntegrationProvider {
  public constructor(private readonly api: OEmbedAPI) {
    super(IntegrationID.VIMEO, 'Vimeo', false)
  }

  public hasSupportForUrl(url: string): boolean {
    const { id } = getDetailsFromURL(url)
    return id !== undefined
  }

  public async resolveUrl(url: string): Promise<Clip> {
    const { id, timestamp, end } = getDetailsFromURL(url)
    if (!id) {
      throw new Error(`Invalid URL: ${url}.`)
    }
    return this.cache.cached(id, async (): Promise<Clip> => {
      const oembed = await this.api.getOEmbed(`https://vimeo.com/${id}`)
      return {
        id: id,
        url,
        title: oembed.title ?? '',
        channel: oembed.author_name ?? this.name,
        embedUrl: `https://player.vimeo.com/video/${id}`,
        thumbnailUrl: oembed.thumbnail_url ?? '',
        provider: this.id,
        submitters: [],
        metadata: {
          start: timestamp,
          end,
        },
      }
    })
  }

  public getPlayerConfigForClip(clip: Clip): PlayerConfig {
    const url = new URL(clip.embedUrl)
    url.searchParams.append('autoplay', '1')
    url.searchParams.append('muted', '0')
    const hash = new URLSearchParams()
    const timestamp = clip.metadata?.['start']
    if (timestamp) {
      hash.append('t', timestamp)
    }
    const end = clip.metadata?.['end']
    if (end) {
      hash.append('end', end)
    }
    url.hash = hash.toString()
    return {
      type: 'iframe',
      src: url.toString(),
      title: clip.title,
    }
  }
}

const VIDEO_TIMESTAMP_PARAM = 't'
const VIDEO_END_TIMESTAMP_PARAM = 'end'
/**
 * Get the details from a provided URL.
 * @param url - The URL of the video.
 * @returns The details (id, start, end) from the URL.
 */
function getDetailsFromURL(url: string): { id?: string; timestamp?: string; end?: string } {
  try {
    const uri = new URL(url)

    // Only accept valid Vimeo URLs.
    if (!isSupportedProviderURL(OEmbedProviderName.VIMEO, uri)) {
      return {}
    }

    // Get the ID out of the URL.
    //  1. https://vimeo.com/<ID>.
    //  2. https://vimeo.com/<ID>#t=<TIMESTAMP>
    //  3. https://vimeo.com/<ID>#t=<TIMESTAMP>&end=<TIMESTAMP_END>
    const segments = uri.pathname.split('/').filter(Boolean)
    const id = segments.pop()

    const params = new URLSearchParams(uri.hash.slice(1))
    const timestamp = params.get(VIDEO_TIMESTAMP_PARAM) ?? undefined
    const end = params.get(VIDEO_END_TIMESTAMP_PARAM) ?? undefined

    return { id, timestamp, end }
  } catch {
    return {}
  }
}
