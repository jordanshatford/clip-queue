import { AbstractIntegrationAuthentication } from '../core'
import { IntegrationID } from '../indentify'

/**
 * Kick.com OAuth authentication.
 */
export class KickAuthentication extends AbstractIntegrationAuthentication {
  public constructor() {
    super(
      IntegrationID.KICK_AUTH,
      '/api/kick/oath',
      '/api/kick/oath/validate',
      '/api/kick/oath/revoke',
    )
  }
}
