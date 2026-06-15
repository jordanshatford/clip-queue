import type { OEmbedAPI } from '#shared/oembed'

import { IntegrationID } from '../indentify'
import { YouTubeProvider } from './provider'

/**
 * Provider for YouTube.com videos.
 */
export class YouTubeVideoProvider extends YouTubeProvider {
  public constructor(api: OEmbedAPI) {
    super(IntegrationID.YOUTUBE_VIDEOS, 'YouTube Videos', false, 'video', api)
  }
}
