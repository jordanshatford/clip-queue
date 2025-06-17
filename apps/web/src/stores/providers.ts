import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { Clip, PlayerFormat } from '@cq/providers'
import { ClipProvider, providers as ps } from '@cq/providers'

import { useLogger } from '@/stores/logger'
import { useSettings } from '@/stores/settings'
import { useUser } from '@/stores/user'

export const useProviders = defineStore('providers', () => {
  const settings = useSettings()
  const logger = useLogger()

  const providers = ref(
    ps.all({
      [ClipProvider.TWITCH]: () => {
        const user = useUser()
        return user.ctx
      }
    })
  )

  const svg = computed(() => {
    return (provider: ClipProvider) => {
      return providers.value[provider].svg
    }
  })

  const isExperimental = computed(() => {
    return (provider: ClipProvider) => {
      return providers.value[provider].isExperimental
    }
  })

  const hasCachedData = computed(() => {
    return Object.values(providers.value).some((provider) => provider.hasCachedData)
  })

  function purge(): void {
    for (const provider of Object.values(providers.value)) {
      logger.debug(`[Providers]: Purging cache for provider: ${provider.name}.`)
      provider.clearCache()
    }
  }

  async function getClip(url: string): Promise<Clip | undefined> {
    for (const enabledProvider of settings.queue.providers) {
      const provider = providers.value[enabledProvider]
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
        `[Providers]: Attempted to get player format for clip from disabled provider: ${clip.provider}.`
      )
      return
    }
    const provider = providers.value[clip.provider]
    return provider.getPlayerFormat(clip)
  }

  function getPlayerSource(clip: Clip): string | undefined {
    if (!settings.queue.providers.includes(clip.provider)) {
      logger.warn(
        `[Providers]: Attempted to get player source for clip from disabled provider: ${clip.provider}.`
      )
      return
    }
    const provider = providers.value[clip.provider]
    return provider.getPlayerSource(clip)
  }

  return {
    svg,
    isExperimental,
    hasCachedData,
    purge,
    getClip,
    getPlayerFormat,
    getPlayerSource
  }
})
