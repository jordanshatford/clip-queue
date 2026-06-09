import type { Clip, PlayerConfig } from '../core'

import { AbstractIntegrationProvider } from '../core'
import { IntegrationID } from '../indentify'
import { getOEmbed } from './core/api'

/**
 * Provider for Streamable.com content.
 */
export class StreamableProvider extends AbstractIntegrationProvider {
  public constructor() {
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
    return this.cached(id, async (): Promise<Clip> => {
      const endpoint = `https://api.streamable.com/oembed.json?url=https://streamable.com/${id}`
      const oembed = await getOEmbed(endpoint)
      return {
        id: id,
        url,
        title: oembed.title,
        channel: oembed.author_name ?? oembed.provider_name,
        embedUrl: `https://streamable.com/e/${id}`,
        thumbnailUrl: oembed.thumbnail_url,
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
    if (!['streamable.com', 'www.streamable.com'].includes(uri.hostname)) {
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
