import type { Reactive } from 'vue'

import type { IntegrationAuthentication } from '~/integrations/core'

import { authentication } from '~/integrations/twitch'

export const useUser = defineStore('user', () => {
  const auth: Reactive<IntegrationAuthentication> = authentication
  const integrations = useIntegrations()
  const logger = useLogger()

  const isLoggedIn = computed(() => auth.isLoggedIn)
  const details = computed(() => auth.user)
  const token = computed(() => auth.token)

  const isInitialized = ref<boolean>(false)
  const isLoading = ref<boolean>(false)

  async function init(): Promise<void> {
    if (isInitialized.value) {
      return
    }

    isLoading.value = true
    logger.debug('[Auth]: Attempting auto-login initialization.')

    try {
      await autoLoginIfPossible()
      if (isLoggedIn.value) {
        logger.debug(`[Auth]: Logged in as ${details.value?.name ?? 'unknown'}.`)
      } else {
        logger.debug('[Auth]: No existing session found.')
      }
    } catch (error) {
      logger.error(`[Auth]: Auto-login failed. ${error}`)
    } finally {
      isInitialized.value = true
      isLoading.value = false
    }
  }

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
    isLoggedIn,
    details,
    token,
    init,
    autoLoginIfPossible,
    redirect,
    login,
    logout,
  }
})
