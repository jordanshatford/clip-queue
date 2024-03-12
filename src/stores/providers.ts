import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  KickProvider,
  TwitchProvider,
  YouTubeProvider,
  type Clip,
  type PlayerFormat,
  type IClipProvider,
  ClipProvider
} from '@/providers'
import { useSettings } from '@/stores/settings'

export const useProviders = defineStore('providers', () => {
  const settings = useSettings()

  const providers = ref<Partial<Record<ClipProvider, IClipProvider>>>({
    [ClipProvider.KICK]: new KickProvider(),
    [ClipProvider.TWITCH]: new TwitchProvider(),
    [ClipProvider.YOUTUBE]: new YouTubeProvider()
  })

  const hasCachedData = computed(() => {
    return Object.values(providers.value).some((p) => p.hasCachedData)
  })

  function purge() {
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
    const p = providers.value[clip.provider]
    return p?.getPlayerFormat(clip)
  }

  function getPlayerSource(clip: Clip): string | undefined {
    if (!settings.queue.providers.includes(clip.provider)) {
      return
    }
    const p = providers.value[clip.provider]
    return p?.getPlayerSource(clip)
  }

  return {
    providers,
    hasCachedData,
    purge,
    getClip,
    getPlayerFormat,
    getPlayerSource
  }
})
