import type { OEmbedAPI } from '#shared/oembed'

import { IntegrationID } from '../indentify'
import { RumbleProvider } from './provider'

/**
 * Provider for Rumble.com shorts.
 */
export class RumbleShortProvider extends RumbleProvider {
  public constructor(api: OEmbedAPI) {
    super(IntegrationID.RUMBLE_SHORTS, 'Rumble Shorts', false, 'short', api)
  }
}
