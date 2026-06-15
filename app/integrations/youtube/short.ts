import type { OEmbedAPI } from '#shared/oembed'

import { IntegrationID } from '../indentify'
import { YouTubeProvider } from './provider'

/**
 * Provider for YouTube.com shorts.
 */
export class YouTubeShortProvider extends YouTubeProvider {
  public constructor(api: OEmbedAPI) {
    super(IntegrationID.YOUTUBE_SHORTS, 'YouTube Shorts', false, 'short', api)
  }
}
