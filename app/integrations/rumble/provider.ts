import { parseEmbedURLFromHTML, type OEmbedAPI } from '~~/shared/oembed'

import { isSupportedProviderURL, OEmbedProviderName } from '#shared/oembed'

import type { IntegrationID } from '../indentify'

import { AbstractIntegrationProvider, type Clip, type PlayerConfig } from '../core'

/**
 * Type of provider available for the Rumble provider.
 */
type RumbleProviderType = 'short' | 'video'

/**
 * A common Rumble provider that supports 'short' or 'video' as the type.
 */
export class RumbleProvider extends AbstractIntegrationProvider {
  public constructor(
    id: IntegrationID,
    name: string,
    defaultIsEnabled: boolean,
    private readonly type: RumbleProviderType,
    private readonly api: OEmbedAPI,
  ) {
    super(id, name, defaultIsEnabled)
  }

  public hasSupportForUrl(url: string): boolean {
    const { type, id } = getRumbleUrlDetails(url)
    return id !== undefined && type === this.type
  }

  public async resolveUrl(url: string): Promise<Clip> {
    const { id, type, timestamp } = getRumbleUrlDetails(url)
    if (!id || type !== this.type) {
      throw new Error(`Invalid URL: ${url}.`)
    }
    return this.cache.cached(id, async (): Promise<Clip> => {
      const oembed = await this.api.getOEmbed(url)
      return {
        id: id,
        url,
        title: oembed.title ?? '',
        channel: oembed?.author_name ?? this.name,
        embedUrl: parseEmbedURLFromHTML(oembed),
        thumbnailUrl: oembed.thumbnail_url ?? '',
        provider: this.id,
        submitters: [],
        metadata: this.type === 'video' ? { start: timestamp } : undefined,
      }
    })
  }

  public getPlayerConfigForClip(clip: Clip): PlayerConfig {
    const url = new URL(clip.embedUrl)
    url.searchParams.append('autoplay', '2')
    if (this.type === 'video') {
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

const SHORT_PATH_SUFFIX = '/shorts/'
const EMBED_PATH_SUFFIX = '/embed/'
const TIMESTAMP_PARAM = 'start'
/**
 * Get details from a provided URL.
 * @param url - The URL of the vod.
 * @returns The details (id, timestamp) from the URL.
 */
export function getRumbleUrlDetails(url: string): {
  type?: RumbleProviderType
  id?: string
  timestamp?: string
} {
  try {
    const uri = new URL(url)

    // Only accept valid Rumble URLs.
    if (!isSupportedProviderURL(OEmbedProviderName.RUMBLE, uri)) {
      return {}
    }

    const segments = uri.pathname.split('/').filter(Boolean)

    // Get the ID out of the URL.
    //  1. https://rumble.com/shorts/<ID>
    //  2. https://rumble.com/embed/<ID>/
    //  3. https://rumble.com/embed/<ID>/?start=<TIMESTAMP>
    //  4. https://rumble.com/<ID>-<NAME>.html
    //  5. https://rumble.com/<ID>-<NAME>.html?start=<TIMESTAMP>
    if (uri.pathname.startsWith(SHORT_PATH_SUFFIX)) {
      if (segments.length < 2) {
        return {}
      }
      const id = segments.pop()
      return { type: 'short', id }
    }

    const timestamp = uri.searchParams.get(TIMESTAMP_PARAM) ?? undefined
    if (uri.pathname.startsWith(EMBED_PATH_SUFFIX)) {
      if (segments.length < 2) {
        return {}
      }
      const id = segments.pop()
      return { type: 'video', id, timestamp }
    }

    if (!uri.pathname.endsWith('.html')) {
      return {}
    }

    const id = segments.pop()
    return { type: 'video', id, timestamp }
  } catch {
    return {}
  }
}
