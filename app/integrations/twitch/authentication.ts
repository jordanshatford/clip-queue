import { AbstractIntegrationAuthentication } from '../core'
import { IntegrationID } from '../indentify'

/**
 * Twitch.tv OAuth authentication.
 */
export class TwitchAuthentication extends AbstractIntegrationAuthentication {
  public constructor() {
    super(
      IntegrationID.TWITCH_AUTH,
      '/api/twitch/oath',
      '/api/twitch/oath/validate',
      '/api/twitch/oath/revoke',
    )
  }
}
