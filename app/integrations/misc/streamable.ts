import type { OEmbedAPI } from '#shared/oembed'

import { isSupportedProviderURL, OEmbedProviderName } from '#shared/oembed'

import type { Clip, PlayerConfig } from '../core'

import { AbstractIntegrationProvider } from '../core'
import { IntegrationID } from '../indentify'

/**
 * Provider for Streamable.com content.
 */
export class StreamableProvider extends AbstractIntegrationProvider {
  public constructor(private readonly api: OEmbedAPI) {
    super(IntegrationID.STREAMABLE, 'Streamable', false)
  }

  public hasSupportForUrl(url: string): boolean {
    return getIdFromURL(url) !== undefined
  }

  public async resolveUrl(url: string): Promise<Clip> {
    const id = getIdFromURL(url)
    if (!id) {
      throw new Error(`Invalid URL: ${url}.`)
    }
    return this.cache.cached(id, async (): Promise<Clip> => {
      const oembed = await this.api.getOEmbed(`https://streamable.com/${id}`)
      return {
        id: id,
        url,
        title: oembed.title ?? '',
        channel: oembed.author_name ?? this.name,
        embedUrl: `https://streamable.com/e/${id}`,
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

/**
 * Get the ID from a provided URL.
 * @param url - The URL of the video.
 * @returns The ID or undefined if the URL is not valid.
 */
function getIdFromURL(url: string): string | undefined {
  try {
    const uri = new URL(url)

    // Only accept valid Streamable URLs.
    if (!isSupportedProviderURL(OEmbedProviderName.STREAMABLE, uri)) {
      return
    }

    // Get the ID out of the URL. https://streamable.com/<ID>.
    const segments = uri.pathname.split('/').filter(Boolean)
    const id = segments.pop()
    return id
  } catch {
    return
  }
}
