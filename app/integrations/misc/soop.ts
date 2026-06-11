import type { OEmbedAPI } from '#shared/oembed'

import { isSupportedProviderURL, OEmbedProviderName } from '#shared/oembed'

import type { Clip, PlayerConfig } from '../core'

import { AbstractIntegrationProvider } from '../core'
import { IntegrationID } from '../indentify'

/**
 * Provider for Sooplive.com content.
 */
export class SoopProvider extends AbstractIntegrationProvider {
  public constructor(private readonly api: OEmbedAPI) {
    super(IntegrationID.SOOP, 'Soop', false)
  }

  public hasSupportForUrl(url: string): boolean {
    const { id } = getDetailsFromURL(url)
    return id !== undefined
  }

  public async resolveUrl(url: string): Promise<Clip> {
    const { id, timestamp } = getDetailsFromURL(url)
    if (!id) {
      throw new Error(`Invalid URL: ${url}.`)
    }
    return this.cached(id, async (): Promise<Clip> => {
      const oembed = await this.api.getOEmbed(`https://vod.sooplive.com/player/${id}`)
      return {
        id: id,
        url,
        title: oembed.title ?? '',
        channel: oembed.author_name ?? this.name,
        embedUrl: `https://vod.sooplive.com/player/${id}/embed`,
        thumbnailUrl: oembed.thumbnail_url ?? '',
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
    url.searchParams.append('autoPlay', 'true')
    const start = clip.metadata?.['start']
    if (start) {
      url.searchParams.append(VIDEO_TIMESTAMP_PARAM, start)
    }
    return {
      type: 'iframe',
      src: url.toString(),
      title: clip.title,
    }
  }
}

const VIDEO_TIMESTAMP_PARAM = 'change_second'
/**
 * Get the details from a provided URL.
 * @param url - The URL of the video.
 * @returns The details (id, timestamp) from the URL.
 */
function getDetailsFromURL(url: string): { id?: string; timestamp?: string } {
  try {
    const uri = new URL(url)

    // Only accept valid Soop URLs.
    if (!isSupportedProviderURL(OEmbedProviderName.SOOP, uri)) {
      return {}
    }

    // Get the ID out of the URL.
    //  1. https://vod.sooplive.com/player/<ID>.
    //  2. https://vod.sooplive.com/player/<ID>?change_second=<TIMESTAMP>
    const segments = uri.pathname.split('/').filter(Boolean)
    const id = segments.pop()

    const timestamp = uri.searchParams.get(VIDEO_TIMESTAMP_PARAM) ?? undefined

    return { id, timestamp }
  } catch {
    return {}
  }
}
