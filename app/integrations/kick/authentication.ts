import { AbstractIntegrationAuthentication } from '../core'
import { IntegrationID } from '../indentify'

/**
 * Kick.com OAuth authentication.
 */
export class KickAuthentication extends AbstractIntegrationAuthentication {
  public constructor() {
    super(IntegrationID.KICK_AUTH)
  }

  public async autoLogin(): Promise<void> {
    const current = await $fetch('/api/kick/oath/validate', {
      method: 'POST',
    })

    if (!current) {
      throw new Error(`[${this.id}]: No valid session found.`)
    }

    this._user = current.user
    this._isLoggedIn = true
  }

  public async login(): Promise<void> {
    await navigateTo('/api/kick/oath', { external: true })
  }

  public async logout(): Promise<void> {
    super.reset()
    return await $fetch('/api/kick/oath/revoke', { method: 'POST' })
  }
}
