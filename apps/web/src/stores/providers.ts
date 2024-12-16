import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { Clip, PlayerFormat } from '@cq/providers'
import { ClipProvider, providers as ps } from '@cq/providers'

import { useSettings } from '@/stores/settings'
import { useUser } from '@/stores/user'

export const useProviders = defineStore('providers', () => {
  const settings = useSettings()

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
      return providers.value[provider]?.svg
    }
  })

  const isExperimental = computed(() => {
    return (provider: ClipProvider) => {
      return providers.value[provider]?.isExperimental
    }
  })

  const hasCachedData = computed(() => {
    return Object.values(providers.value).some((provider) => provider.hasCachedData)
  })

  function purge(): void {
    for (const p of Object.values(providers.value)) {
      p.clearCache?.()
    }
  }

  async function getClip(url: string): Promise<Clip | undefined> {
    for (const ep of settings.queue.providers) {
      const p = providers.value[ep]
      const c = await p?.getClip(url)
      if (c !== undefined) {
        return c
      }
    }
  }

  function getPlayerFormat(clip: Clip): PlayerFormat | undefined {
    if (!settings.queue.providers.includes(clip.provider)) {
      return
    }
    const provider = providers.value[clip.provider]
    return provider?.getPlayerFormat(clip)
  }

  function getPlayerSource(clip: Clip): string | undefined {
    if (!settings.queue.providers.includes(clip.provider)) {
      return
    }
    const provider = providers.value[clip.provider]
    return provider?.getPlayerSource(clip)
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
