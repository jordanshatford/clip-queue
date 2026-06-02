import type { UserDetails, IntegrationAuthentication } from '../core'

import { IntegrationID } from '../indentify'

/**
 * Kick.com OAuth authentication.
 */
export class KickAuthentication implements IntegrationAuthentication {
  public readonly id = IntegrationID.KICK_AUTH
  public isLoggedIn = false

  private _user: UserDetails | undefined = undefined
  public get user(): UserDetails {
    return this._user ?? { id: '', name: '', profileImageURL: '' }
  }

  public async autoLogin(): Promise<void> {
    const current = await $fetch('/api/kick/oath/validate', {
      method: 'POST',
    })

    if (!current) {
      throw new Error(`[${this.id}]: No valid session found.`)
    }

    this._user = current.user
    this.isLoggedIn = true
  }

  public async login(): Promise<void> {
    await navigateTo('/api/kick/oath', { external: true })
  }

  public async logout(): Promise<void> {
    this.isLoggedIn = false
    this._user = undefined
    return await $fetch('/api/kick/oath/revoke', { method: 'POST' })
  }
}
