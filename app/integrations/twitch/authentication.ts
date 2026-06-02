import type { UserDetails, IntegrationAuthentication, AuthenticationDetails } from '../core'

import { IntegrationID } from '../indentify'

/**
 * Twitch.tv OAuth authentication.
 */
export class TwitchAuthentication implements IntegrationAuthentication {
  public readonly id: IntegrationID = IntegrationID.TWITCH_AUTH
  public isLoggedIn = false

  private _user: UserDetails | undefined = undefined
  public get user(): UserDetails {
    return this._user ?? { id: '', name: '', profileImageURL: '' }
  }

  private _details: AuthenticationDetails = { clientId: '', accessToken: '' }
  public get details(): AuthenticationDetails {
    return this._details
  }

  public async autoLogin(): Promise<void> {
    const current = await $fetch('/api/twitch/oath/validate', {
      method: 'POST',
    })

    if (!current) {
      throw new Error(`[${this.id}]: No valid session found.`)
    }

    this._user = current.user
    this._details = current.authentication
    this.isLoggedIn = true
  }

  public async login(): Promise<void> {
    await navigateTo('/api/twitch/oath', { external: true })
  }

  public async logout(): Promise<void> {
    this.isLoggedIn = false
    this._user = undefined
    this._details = { clientId: '', accessToken: '' }
    return await $fetch('/api/twitch/oath/revoke', { method: 'POST' })
  }
}
