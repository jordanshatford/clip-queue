import { useStorage } from '@vueuse/core'

import type { UserDetails, IntegrationAuthentication } from '../core'

import { toStorageKey } from '../core'
import { IntegrationID } from '../indentify'

const SESSION_COOKIE = 'twitch_session'

const user = useStorage<UserDetails>(toStorageKey(IntegrationID.TWITCH_AUTH, 'user'), {
  id: '',
  name: '',
  profileImageURL: '',
})

export class TwitchAuthentication implements IntegrationAuthentication {
  public readonly id: IntegrationID = IntegrationID.TWITCH_AUTH
  public isLoggedIn = false

  public get user(): UserDetails {
    return user.value
  }

  public get token(): string {
    const cookie = useCookie<{ access_token: string }>(SESSION_COOKIE)
    if (cookie.value) {
      return cookie.value.access_token
    }
    return ''
  }

  public async redirect(): Promise<void> {
    await navigateTo('/api/twitch/oath', { external: true })
  }

  public async autoLogin(): Promise<UserDetails> {
    const current = await $fetch('/api/twitch/oath/validate', {
      method: 'POST',
    })

    if (!current) {
      throw new Error('No valid session found.')
    }

    user.value = {
      id: current.id,
      name: current.display_name,
      profileImageURL: current.profile_image_url,
    }
    this.isLoggedIn = true
    return user.value
  }

  public async login(_: string): Promise<UserDetails> {
    return user.value
  }

  public async logout(): Promise<void> {
    this.isLoggedIn = false
    user.value = undefined
    return await $fetch('/api/twitch/oath/revoke', { method: 'POST' })
  }
}
