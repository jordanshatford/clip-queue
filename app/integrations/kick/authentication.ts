import type { UserDetails, IntegrationAuthentication } from '../core'

import { IntegrationID } from '../indentify'

const user = ref<UserDetails | undefined>(undefined)

export class KickAuthentication implements IntegrationAuthentication {
  public readonly id = IntegrationID.KICK_AUTH
  public isLoggedIn = false

  public get user(): UserDetails {
    return user.value ?? { id: '', name: '', profileImageURL: '' }
  }

  public async redirect(): Promise<void> {
    await navigateTo('/api/kick/oath', { external: true })
  }

  public async login(_: string): Promise<UserDetails> {
    // TODO(jordan): clean this up after reworking integrations authentication.
    return this.user
  }

  public async autoLogin(): Promise<UserDetails> {
    const current = await $fetch('/api/kick/oath/validate', {
      method: 'POST',
    })

    if (!current) {
      throw new Error('No valid session found.')
    }

    user.value = current.user
    this.isLoggedIn = true
    return user.value
  }

  public async logout(): Promise<void> {
    this.isLoggedIn = false
    user.value = undefined
    return await $fetch('/api/kick/oath/revoke', { method: 'POST' })
  }
}
