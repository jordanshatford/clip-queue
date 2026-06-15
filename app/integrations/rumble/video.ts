import type { OEmbedAPI } from '#shared/oembed'

import { IntegrationID } from '../indentify'
import { RumbleProvider } from './provider'

/**
 * Provider for Rumble.com videos.
 */
export class RumbleVideoProvider extends RumbleProvider {
  public constructor(api: OEmbedAPI) {
    super(IntegrationID.RUMBLE_VIDEOS, 'Rumble Videos', false, 'video', api)
  }
}
