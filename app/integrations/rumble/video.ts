import type { Clip, PlayerConfig } from '../core'

import { AbstractIntegrationProvider } from '../core'
import { IntegrationID } from '../indentify'
import { toEmbedUrl } from '../misc/core/utils'
import { getRumbleOEmbed } from './core/api'
import { getRumbleUrlDetails } from './core/utils'

/**
 * Provider for Rumble.com videos.
 */
export class RumbleVideoProvider extends AbstractIntegrationProvider {
  public constructor() {
    super(IntegrationID.RUMBLE_VIDEOS, 'Rumble Videos', false)
  }

  public hasClipSupport(url: string): boolean {
    const { type, id } = getRumbleUrlDetails(url)
    return id !== undefined && type === 'video'
  }

  public async getClip(url: string): Promise<Clip> {
    const { id, timestamp } = getRumbleUrlDetails(url)
    if (!id) {
      throw new Error(`Invalid URL: ${url}.`)
    }
    return this.cached(id, async (): Promise<Clip> => {
      const oembed = await getRumbleOEmbed(url)
      return {
        id: id,
        url,
        title: oembed.title,
        channel: oembed?.author_name ?? this.name,
        embedUrl: toEmbedUrl(oembed),
        thumbnailUrl: oembed.thumbnail_url,
        provider: this.id,
        submitters: [],
        metadata: {
          start: timestamp,
        },
      }
    })
  }

  public getPlayerConfig(clip: Clip): PlayerConfig {
    let src = `${clip.embedUrl}?autoplay=2`
    const timestamp = clip.metadata?.['start']
    if (timestamp && typeof timestamp === 'string') {
      src = `${src}&start=${timestamp}`
    }
    return {
      type: 'iframe',
      src,
      title: clip.title,
    }
  }
}
