import { useStorage } from '@vueuse/core'

import type { UserDetails, IntegrationAuthentication } from '../core'

import { toStorageKey } from '../core'
import { IntegrationID } from '../indentify'

const user = useStorage<UserDetails>(toStorageKey(IntegrationID.KICK_AUTH, 'user'), {
  id: '',
  name: '',
  profileImageURL: '',
})

export class KickAuthentication implements IntegrationAuthentication {
  public readonly id = IntegrationID.KICK_AUTH
  public isLoggedIn = false

  public get user(): UserDetails {
    return user.value
  }

  public get token(): string {
    return user.value.id
  }

  public async redirect(): Promise<void> {
    await navigateTo('/api/kick/oath', { external: true })
  }

  public async login(_: string): Promise<UserDetails> {
    // TODO(jordan): clean this up after reworking integrations authentication.
    return user.value
  }

  public async autoLogin(): Promise<UserDetails> {
    const current = await $fetch('/api/kick/oath/validate', {
      method: 'POST',
    })

    if (!current) {
      throw new Error('No valid session found.')
    }

    user.value = {
      id: current.user_id.toString(),
      name: current.name,
      profileImageURL: current.profile_picture,
    }
    this.isLoggedIn = true
    return user.value
  }

  public async logout(): Promise<void> {
    this.isLoggedIn = false
    user.value = undefined
    return await $fetch('/api/kick/oath/revoke', { method: 'POST' })
  }
}
