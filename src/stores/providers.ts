import { defineStore } from 'pinia'
import { computed, type Reactive } from 'vue'

import {
  type Clip,
  type PlayerFormat,
  IntegrationProviderID,
  type IntegrationProvider,
  integrations,
} from '@/integrations'
import { useLogger } from '@/stores/logger'
import { useSettings } from '@/stores/settings'

export const useProviders = defineStore('providers', () => {
  const settings = useSettings()
  const logger = useLogger()

  const providers = computed((): Reactive<IntegrationProvider>[] =>
    integrations.flatMap((i) => i.providers),
  )

  const svg = computed(() => {
    return (provider: IntegrationProviderID) => {
      for (const integration of integrations) {
        for (const p of integration.providers) {
          if (p.id === provider) {
            return integration.icon
          }
        }
      }
    }
  })

  const isExperimental = computed(() => {
    return (provider: IntegrationProviderID) => {
      return providers.value.find((p) => p.id === provider)?.isExperimental
    }
  })

  const hasCachedData = computed(() => {
    return providers.value.some((p) => p.hasCachedData)
  })

  function purge(): void {
    for (const provider of providers.value) {
      logger.info(`[Providers]: Purging cache for provider: ${provider.name}.`)
      provider.clearCache()
    }
  }

  async function getClip(url: string): Promise<Clip | undefined> {
    for (const provider of providers.value) {
      if (!provider.isEnabled) {
        continue
      }
      if (!provider.hasClipSupport(url)) {
        continue
      }
      try {
        const clip = await provider.getClip(url)
        logger.debug(`[${provider.name}]: Successfully retrieved clip for URL: ${url}.`)
        return clip
      } catch (error) {
        logger.error(`${error}`)
        continue
      }
    }
  }

  function getPlayerFormat(clip: Clip): PlayerFormat | undefined {
    if (!settings.queue.providers.includes(clip.provider)) {
      logger.warn(
        `[Providers]: Attempted to get player format for clip from disabled provider: ${clip.provider}.`,
      )
      return
    }
    const provider = providers.value.find((p) => p.id === clip.provider)
    return provider?.getPlayerFormat(clip)
  }

  function getPlayerSource(clip: Clip): string | undefined {
    if (!settings.queue.providers.includes(clip.provider)) {
      logger.warn(
        `[Providers]: Attempted to get player source for clip from disabled provider: ${clip.provider}.`,
      )
      return
    }
    const provider = providers.value.find((p) => p.id === clip.provider)
    return provider?.getPlayerSource(clip)
  }

  return {
    svg,
    isExperimental,
    hasCachedData,
    purge,
    getClip,
    getPlayerFormat,
    getPlayerSource,
  }
})
