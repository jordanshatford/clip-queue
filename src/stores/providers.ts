import { defineStore } from 'pinia'
import { computed, type Reactive } from 'vue'

import {
  type Clip,
  type PlayerFormat,
  IntegrationID,
  type IntegrationProvider,
  integrations,
} from '@/integrations'
import { useLogger } from '@/stores/logger'

export const useProviders = defineStore('providers', () => {
  const logger = useLogger()

  const providers = computed((): Reactive<IntegrationProvider>[] =>
    integrations.flatMap((i) => i.providers),
  )

  const provider = computed(() => {
    return (id: IntegrationID) => {
      return providers.value.find((p) => p.id === id)
    }
  })

  const name = computed(() => {
    return (id: IntegrationID) => {
      return provider.value(id)?.name
    }
  })

  const icon = computed(() => {
    return (id: IntegrationID) => {
      for (const integration of integrations) {
        for (const provider of integration.providers) {
          if (provider.id === id) {
            return integration.icon
          }
        }
      }
    }
  })

  const isExperimental = computed(() => {
    return (id: IntegrationID) => {
      return provider.value(id)?.isExperimental
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
    const p = provider.value(clip.provider)
    if (!p?.isEnabled) {
      logger.warn(
        `[Providers]: Attempted to get player format for clip from disabled provider: ${clip.provider}.`,
      )
      return
    }
    return p?.getPlayerFormat(clip)
  }

  function getPlayerSource(clip: Clip): string | undefined {
    const p = provider.value(clip.provider)
    if (!p?.isEnabled) {
      logger.warn(
        `[Providers]: Attempted to get player source for clip from disabled provider: ${clip.provider}.`,
      )
      return
    }
    return p?.getPlayerSource(clip)
  }

  return {
    provider,
    name,
    icon,
    isExperimental,
    hasCachedData,
    purge,
    getClip,
    getPlayerFormat,
    getPlayerSource,
  }
})
