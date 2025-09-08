import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { TwitchUserCtx } from '@cq/services/twitch'
import twitch from '@cq/services/twitch'

import { env } from '@/config'
import { useLogger } from './logger'
import { useSources } from './sources'

const { CLIENT_ID, REDIRECT_URI } = env

export const useUser = defineStore(
  'user',
  () => {
    const sources = useSources()
    const logger = useLogger()

    const hasValidatedToken = ref<boolean>(false)
    const isLoggedIn = ref<boolean>(false)
    const ctx = ref<TwitchUserCtx>({
      id: CLIENT_ID,
      token: undefined,
      username: undefined
    })

    function redirect(): void {
      twitch.redirect(ctx.value, REDIRECT_URI, ['openid', 'chat:read'])
    }

    async function autoLoginIfPossible(): Promise<void> {
      if (hasValidatedToken.value) {
        return
      }
      if (ctx.value.token && (await twitch.isLoginValid(ctx.value))) {
        isLoggedIn.value = true
        await sources.connect()
      } else {
        await logout()
      }
      hasValidatedToken.value = true
    }

    async function login(hash: string): Promise<void> {
      const authInfo = twitch.login(hash)
      if (authInfo === null) {
        return
      }
      const { access_token, decodedIdToken } = authInfo
      const currentCtx = ctx.value
      if (
        currentCtx.token !== access_token ||
        currentCtx.username !== decodedIdToken.preferred_username
      ) {
        ctx.value = {
          ...currentCtx,
          token: access_token,
          username: decodedIdToken.preferred_username
        }
        // Attempt to get the username from Twitch API as the preferred username may not be set
        // or the user may have a preferred username that is different from their Twitch username.
        // For example, if the user has simplified chinese characters in their preferred username.
        let failed = false
        try {
          const users = await twitch.getUsers(ctx.value, [])
          if (users.length > 0) {
            ctx.value.username = users[0]?.login
          } else {
            failed = true
          }
        } catch (error) {
          logger.error(`[Twitch]: ${error}`)
          failed = true
        }
        if (failed) {
          logger.warn(
            `[Twitch]: Failed to get user from Twitch API. Using preferred username: ${decodedIdToken.preferred_username}.`
          )
          ctx.value.username = decodedIdToken.preferred_username
        }
        isLoggedIn.value = true
        await sources.connect()
      }
    }

    async function logout(): Promise<void> {
      const originalCtx = ctx.value
      ctx.value = {
        ...originalCtx,
        token: undefined,
        username: undefined
      }
      isLoggedIn.value = false
      await sources.disconnect()
      if (originalCtx.id && originalCtx.token) {
        try {
          await twitch.logout(originalCtx)
        } catch (e) {
          logger.error(`[Twitch]: Failed to logout: ${e}.`)
        }
      }
    }

    return {
      hasValidatedToken,
      isLoggedIn,
      ctx,
      autoLoginIfPossible,
      redirect,
      login,
      logout
    }
  },
  {
    persist: {
      key: 'cq-user',
      pick: ['ctx.token', 'ctx.username']
    }
  }
)
