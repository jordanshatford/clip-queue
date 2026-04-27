import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { authentication } from '@/integrations/twitch'

import { useLogger } from './logger'
import { useSources } from './sources'

export const useUser = defineStore('user', () => {
  const integration = authentication
  const sources = useSources()
  const logger = useLogger()

  const hasAttemptedAutoLogin = ref<boolean>(false)
  const isLoggedIn = computed(() => integration.isLoggedIn.value)
  const details = computed(() => integration.user.value)
  const token = computed(() => integration.token.value)

  function redirect(): void {
    integration.redirect()
  }

  async function autoLoginIfPossible(): Promise<void> {
    try {
      const user = await integration.autoLogin()
      if (user) {
        await sources.connect()
      }
    } catch {
      logger.debug('[User]: failed auto-login attempt.')
      hasAttemptedAutoLogin.value = true
    }
  }

  async function login(hash: string): Promise<void> {
    const user = await integration.login(hash)
    if (user) {
      await sources.connect()
    }
  }

  async function logout(): Promise<void> {
    await sources.disconnect()
    await integration.logout()
  }

  return {
    hasAttemptedAutoLogin,
    isLoggedIn,
    details,
    token,
    autoLoginIfPossible,
    redirect,
    login,
    logout,
  }
})
