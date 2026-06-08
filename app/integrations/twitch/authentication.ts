import { AbstractIntegrationAuthentication } from '../core'
import { IntegrationID } from '../indentify'

/**
 * Twitch.tv OAuth authentication.
 */
export class TwitchAuthentication extends AbstractIntegrationAuthentication {
  public constructor() {
    super(IntegrationID.TWITCH_AUTH)
  }

  public override async autoLogin(): Promise<void> {
    const current = await $fetch('/api/twitch/oath/validate', {
      method: 'POST',
    })

    if (!current) {
      throw new Error(`[${this.id}]: No valid session found.`)
    }

    this._user = current.user
    this._details = current.authentication
    this._isLoggedIn = true
  }

  public async login(): Promise<void> {
    await navigateTo('/api/twitch/oath', { external: true })
  }

  public async logout(): Promise<void> {
    super.reset()
    return await $fetch('/api/twitch/oath/revoke', { method: 'POST' })
  }
}
