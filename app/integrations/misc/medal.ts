import type { Clip, PlayerConfig } from '../core'
import type { OEmbedResponse } from './core/types'

import { AbstractIntegrationProvider } from '../core'
import { IntegrationID } from '../indentify'
import { getOEmbedProxied } from './core/api'
import { toEmbedUrl } from './core/utils'

/**
 * Provider for Medal.tv content.
 */
export class MedalProvider extends AbstractIntegrationProvider {
  public constructor() {
    super(IntegrationID.MEDAL, 'Medal', false)
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
      const endpoint = `https://medal.tv/api/oembed?url=https://medal.tv/clips/${id}`
      const oembed: OEmbedResponse = await getOEmbedProxied(endpoint)
      return {
        id: id,
        url,
        title: oembed.title,
        channel: oembed.author_name ?? this.name,
        embedUrl: toEmbedUrl(oembed),
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

const GAMES_PATH_SUFFIX = '/games/'
const CLIPS_PATH_SUFFIX = '/clips/'
/**
 * Get the ID from a provided URL.
 * @param url - The URL of the video.
 * @returns The ID or undefined if the URL is not valid.
 */
function getIdFromURL(url: string): string | undefined {
  try {
    const uri = new URL(url)

    // Only accept valid Medal URLs.
    if (!['medal.tv', 'www.medal.tv'].includes(uri.hostname)) {
      return
    }

    if (!uri.pathname.includes(CLIPS_PATH_SUFFIX)) {
      return
    }

    // Get the ID out of the URL.
    //  1. https://medal.tv/clips/<ID>
    //  2. https://medal.tv/games/<GAME>/clips/<ID>
    const segments = uri.pathname.split('/').filter(Boolean)
    if (segments.length < 2 || (uri.pathname.includes(GAMES_PATH_SUFFIX) && segments.length < 4)) {
      return
    }
    const id = segments.pop()
    return id
  } catch {
    return
  }
}
