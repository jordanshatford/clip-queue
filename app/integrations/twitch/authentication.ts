import type { UserDetails, IntegrationAuthentication, AuthenticationDetails } from '../core'

import { IntegrationID } from '../indentify'

const user = ref<UserDetails | undefined>(undefined)
const authentication = ref<AuthenticationDetails>({
  clientId: '',
  accessToken: '',
})

export class TwitchAuthentication implements IntegrationAuthentication {
  public readonly id: IntegrationID = IntegrationID.TWITCH_AUTH
  public isLoggedIn = false

  public get user(): UserDetails {
    return user.value ?? { id: '', name: '', profileImageURL: '' }
  }

  public get details(): AuthenticationDetails {
    return authentication.value
  }

  public async autoLogin(): Promise<void> {
    const current = await $fetch('/api/twitch/oath/validate', {
      method: 'POST',
    })

    if (!current) {
      throw new Error(`[${this.id}]: No valid session found.`)
    }

    user.value = current.user
    authentication.value = current.authentication
    this.isLoggedIn = true
  }

  public async login(): Promise<void> {
    await navigateTo('/api/twitch/oath', { external: true })
  }

  public async logout(): Promise<void> {
    this.isLoggedIn = false
    user.value = undefined
    authentication.value = { clientId: '', accessToken: '' }
    return await $fetch('/api/twitch/oath/revoke', { method: 'POST' })
  }
}
