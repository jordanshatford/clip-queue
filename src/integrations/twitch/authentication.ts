import { useStorage } from '@vueuse/core'

import { env } from '@/config'

import type { UserDetails, IntegrationAuthentication } from '../core'

import { toStorageKey } from '../core'
import { IntegrationID } from '../indentify'
import { getUsers } from './core/api'
import auth from './core/auth'

const { CLIENT_ID, REDIRECT_URI } = env

const user = useStorage<UserDetails>(toStorageKey(IntegrationID.TWITCH_AUTH, 'user'), {
  id: '',
  name: '',
  profileImageURL: '',
})

const token = useStorage<string>(toStorageKey(IntegrationID.TWITCH_AUTH, 'token'), '')

export class TwitchAuthentication implements IntegrationAuthentication {
  public readonly id: IntegrationID = IntegrationID.TWITCH_AUTH
  public isLoggedIn = false

  public get user(): UserDetails {
    return user.value
  }

  public get token(): string {
    return token.value
  }

  public async redirect(): Promise<void> {
    auth.redirect(CLIENT_ID, REDIRECT_URI, ['openid', 'chat:read'])
  }

  public async autoLogin(): Promise<UserDetails> {
    if (await auth.isLoginValid(this.token)) {
      const details = await this.getUserDetails()
      if (details) {
        user.value = details
      }
      this.isLoggedIn = true
    } else {
      throw new Error('Failed to auto-login user.')
    }
    return this.user
  }

  public async login(hash: string): Promise<UserDetails> {
    const authInfo = auth.login(hash)
    if (authInfo === null) {
      throw new Error('Failed to parse authentication information from URL hash.')
    }
    const { access_token, decodedIdToken } = authInfo

    if (this.user?.name !== decodedIdToken.preferred_username || this.token !== access_token) {
      user.value = {
        id: decodedIdToken.sub,
        name: decodedIdToken.preferred_username,
        profileImageURL: undefined, // Will be populated after fetching user data from Twitch API
      }
      token.value = access_token

      const details = await this.getUserDetails()
      if (details) {
        user.value = details
      }

      this.isLoggedIn = true
      return this.user
    }
    throw new Error('User is already logged in with the same credentials.')
  }

  public async logout(): Promise<void> {
    const t = token.value
    token.value = undefined
    user.value = undefined
    this.isLoggedIn = false
    if (token) {
      try {
        await auth.logout(CLIENT_ID, t)
      } catch (e) {
        throw new Error(`[Twitch]: Failed to logout, ${e}`)
      }
    }
  }

  private async getUserDetails(): Promise<UserDetails | undefined> {
    // Attempt to get the username from Twitch API as the preferred username may not be set
    // or the user may have a preferred username that is different from their Twitch username.
    // For example, if the user has simplified chinese characters in their preferred username.
    try {
      const users = await getUsers(CLIENT_ID, this.token, [])
      if (users.length > 0 && users[0]) {
        return {
          ...user.value,
          id: users[0].id,
          name: users[0].login,
          profileImageURL: users[0].profile_image_url,
        }
      }
    } catch {
      return undefined
    }
  }
}
