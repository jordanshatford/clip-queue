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

    async function autoLoginIfPossible(): Promise<void> {
      if (hasValidatedToken.value) {
        return
      }
      if (ctx.value.token && (await twitch.isLoginValid(ctx.value))) {
        isLoggedIn.value = true
        await connectToSources()
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
        isLoggedIn.value = true
        await connectToSources()
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
      await disconnectFromSources()
      if (originalCtx.id && originalCtx.token) {
        try {
          await twitch.logout(originalCtx)
        } catch (e) {
          console.error('Failed to logout of Twitch: ', e)
        }
      }
    }

    async function connectToSources(): Promise<void> {
      if (ctx.value.username && ctx.value.token) {
        await sources.connect()
      }
    }

    async function disconnectFromSources(): Promise<void> {
      await sources.disconnect()
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
