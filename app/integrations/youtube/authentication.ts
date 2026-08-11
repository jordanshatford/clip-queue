import { AbstractIntegrationAuthentication } from '../core'
import { IntegrationID } from '../indentify'

/**
 * Twitch.tv OAuth authentication.
 */
export class GoogleAuthentication extends AbstractIntegrationAuthentication {
  public constructor() {
    super(
      IntegrationID.YOUTUBE_AUTH,
      '/api/google/oath',
      '/api/google/oath/validate',
      '/api/google/oath/revoke',
    )
  }
}
