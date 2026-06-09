import type { OEmbedAPI } from '#shared/oembed'

import type { Clip, PlayerConfig } from '../core'

import { AbstractIntegrationProvider } from '../core'
import { IntegrationID } from '../indentify'
import { toEmbedUrl } from '../misc/core/utils'
import { getRumbleUrlDetails } from './core/utils'

/**
 * Provider for Rumble.com shorts.
 */
export class RumbleShortProvider extends AbstractIntegrationProvider {
  public constructor(private readonly api: OEmbedAPI) {
    super(IntegrationID.RUMBLE_SHORTS, 'Rumble Shorts', false)
  }

  public hasSupportForUrl(url: string): boolean {
    const { type, id } = getRumbleUrlDetails(url)
    return id !== undefined && type === 'short'
  }

  public async resolveUrl(url: string): Promise<Clip> {
    const { id } = getRumbleUrlDetails(url)
    if (!id) {
      throw new Error(`Invalid URL: ${url}.`)
    }
    return this.cached(id, async (): Promise<Clip> => {
      const oembed = await this.api.getOEmbed(url)
      return {
        id: id,
        url,
        title: oembed.title ?? '',
        channel: oembed?.author_name ?? this.name,
        embedUrl: toEmbedUrl(oembed),
        thumbnailUrl: oembed.thumbnail_url ?? '',
        provider: this.id,
        submitters: [],
      }
    })
  }

  public getPlayerConfigForClip(clip: Clip): PlayerConfig {
    const url = new URL(clip.embedUrl)
    url.searchParams.append('autoplay', '2')
    return {
      type: 'iframe',
      src: url.toString(),
      title: clip.title,
    }
  }
}
