import { defineStore } from 'pinia'
import { computed, ref, type Reactive } from 'vue'

import type { IntegrationAuthentication } from '@/integrations/core'

import { authentication } from '@/integrations/twitch'

import { useIntegrations } from './integrations'
import { useLogger } from './logger'

export const useUser = defineStore('user', () => {
  const auth: Reactive<IntegrationAuthentication> = authentication
  const integrations = useIntegrations()
  const logger = useLogger()

  const hasAttemptedAutoLogin = ref<boolean>(false)
  const isLoggedIn = computed(() => auth.isLoggedIn)
  const details = computed(() => auth.user)
  const token = computed(() => auth.token)

  function redirect(): void {
    auth.redirect()
  }

  async function autoLoginIfPossible(): Promise<void> {
    try {
      await auth.autoLogin()
      await integrations.configureSources()
      await integrations.connectSources()
    } catch {
      logger.debug('[User]: failed auto-login attempt.')
      hasAttemptedAutoLogin.value = true
    }
  }

  async function login(hash: string): Promise<void> {
    await auth.login(hash)
    await integrations.configureSources()
    await integrations.connectSources()
  }

  async function logout(): Promise<void> {
    await integrations.disconnectSources()
    await auth.logout()
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
