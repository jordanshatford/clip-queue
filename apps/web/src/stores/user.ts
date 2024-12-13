import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { AuthInfo, TwitchUserCtx } from '@cq/services/twitch'
import twitch from '@cq/services/twitch'

import { env } from '@/config'
import { useSources } from './sources'

const { CLIENT_ID, REDIRECT_URI } = env

export const useUser = defineStore(
  'user',
  () => {
    const sources = useSources()

    const hasValidatedToken = ref<boolean>(false)
    const isLoggedIn = ref<boolean>(false)
    const ctx = ref<TwitchUserCtx>({ id: CLIENT_ID, token: undefined, username: undefined })
    function redirect(): void {
      twitch.redirect(ctx.value, REDIRECT_URI, ['openid', 'chat:read'])
    }

    async function autoLoginIfPossible() {
      if (hasValidatedToken.value) {
        return
      }
      if (ctx.value.token && (await twitch.isLoginValid(ctx.value))) {
        isLoggedIn.value = true
        await connectToChat()
      } else {
        await logout()
      }
      hasValidatedToken.value = true
    }

    async function login(authInfo: AuthInfo): Promise<void> {
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
        isLoggedIn.value = true
        await connectToChat()
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
          console.error('Failed to logout of Twitch: ', e)
        }
      }
    }

    async function connectToChat() {
      if (ctx.value.username && ctx.value.token) {
        await sources.connect()
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
