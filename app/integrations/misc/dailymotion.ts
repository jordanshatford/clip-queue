import type { OEmbedAPI } from '#shared/oembed'

import type { Clip, PlayerConfig } from '../core'

import { AbstractIntegrationProvider } from '../core'
import { IntegrationID } from '../indentify'

/**
 * Provider for Dailymotion.com content.
 */
export class DailyMotionProvider extends AbstractIntegrationProvider {
  public constructor(private readonly api: OEmbedAPI) {
    super(IntegrationID.DAILYMOTION, 'Dailymotion', false)
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
      const oembed = await this.api.getOEmbed(`https://www.dailymotion.com/video/${id}`)
      return {
        id: id,
        url,
        title: oembed.title ?? '',
        channel: oembed.author_name ?? this.name,
        embedUrl: `https://geo.dailymotion.com/player.html?video=${id}`,
        thumbnailUrl: oembed.thumbnail_url ?? '',
        provider: this.id,
        submitters: [],
      }
    })
  }

  public getPlayerConfigForClip(clip: Clip): PlayerConfig {
    const url = new URL(clip.embedUrl)
    url.searchParams.append('autoplay', 'true')
    return {
      type: 'iframe',
      src: url.toString(),
      title: clip.title,
    }
  }
}

const SHORT_HOSTNAME = 'dai.ly'
const HOSTNAMES = ['dailymotion.com', 'www.dailymotion.com', SHORT_HOSTNAME]
/**
 * Get the ID from a provided URL.
 * @param url - The URL of the video.
 * @returns The ID or undefined if the URL is not valid.
 */
function getIdFromURL(url: string): string | undefined {
  try {
    const uri = new URL(url)

    // Only accept valid Dailymotion URLs.
    if (!HOSTNAMES.some((h) => uri.hostname.endsWith(h))) {
      return
    }

    const segments = uri.pathname.split('/').filter(Boolean)

    // Get the ID out of the URL.
    //  1. https://dai.ly/<ID>
    //  2. https://www.dailymotion.com/video/<ID>
    if (uri.hostname === SHORT_HOSTNAME) {
      const id = segments.pop()
      return id
    }
    if (segments.length < 2) {
      return
    }
    const id = segments.pop()
    return id
  } catch {
    return
  }
}
