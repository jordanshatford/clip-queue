import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

import { env } from '@/config'

import {
  type UserDetails,
  type IntegrationAuthentication,
  IntegrationAuthenticationID,
} from '../common'
import { key } from '../common'
import { getUsers } from './core/api'
import auth from './core/auth'

const { CLIENT_ID, REDIRECT_URI } = env

export class TwitchAuthentication implements IntegrationAuthentication {
  public readonly id: IntegrationAuthenticationID = IntegrationAuthenticationID.TWITCH
  public isLoggedIn = ref<boolean>(false)
  public user = useStorage<UserDetails>(key(this, 'user'), {
    id: '',
    name: '',
    profileImageURL: '',
  })
  public token = useStorage<string>(key(this, 'token'), '')

  public async redirect(): Promise<void> {
    auth.redirect(CLIENT_ID, REDIRECT_URI, ['openid', 'chat:read'])
  }

  public async autoLogin(): Promise<UserDetails> {
    if (await auth.isLoginValid(this.token.value)) {
      this.isLoggedIn.value = true
    } else {
      // Cleanup any details about a previous session as it has expired or does not exist.
      await this.logout()
      throw new Error('Failed to auto-login user.')
    }
    return this.user.value
  }

  public async login(hash: string): Promise<UserDetails> {
    const authInfo = auth.login(hash)
    if (authInfo === null) {
      throw new Error('Failed to parse authentication information from URL hash.')
    }
    const { access_token, decodedIdToken } = authInfo

    if (
      this.user.value?.name !== decodedIdToken.preferred_username ||
      this.token.value !== access_token
    ) {
      this.user.value = {
        id: decodedIdToken.sub,
        name: decodedIdToken.preferred_username,
        profileImageURL: undefined, // Will be populated after fetching user data from Twitch API
      }
      this.token.value = access_token

      // Attempt to get the username from Twitch API as the preferred username may not be set
      // or the user may have a preferred username that is different from their Twitch username.
      // For example, if the user has simplified chinese characters in their preferred username.
      const users = await getUsers(CLIENT_ID, this.token.value, [])
      if (users.length > 0 && users[0]) {
        this.user.value = {
          ...this.user.value,
          id: users[0].id,
          name: users[0].login,
          profileImageURL: users[0].profile_image_url,
        }
      }
      this.isLoggedIn.value = true
      return this.user.value
    }
    throw new Error('User is already logged in with the same credentials.')
  }

  public async logout(): Promise<void> {
    const token = this.token.value
    this.token.value = undefined
    this.user.value = undefined
    this.isLoggedIn.value = false
    if (token) {
      try {
        await auth.logout(CLIENT_ID, token)
      } catch (e) {
        throw new Error(`[Twitch]: Failed to logout, ${e}`)
      }
    }
  }
}
