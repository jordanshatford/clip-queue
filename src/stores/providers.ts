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

export interface Providers {
  providers: Partial<Record<ClipProvider, IClipProvider>>
  enabled: ClipProvider[]
}

export const DEFAULTS: Providers = {
  providers: {},
  enabled: Object.values(ClipProvider)
}

export const useProviders = defineStore(
  'providers',
  () => {
    const providers = ref<Partial<Record<ClipProvider, IClipProvider>>>({
      [ClipProvider.KICK]: new KickProvider(),
      [ClipProvider.TWITCH]: new TwitchProvider(),
      [ClipProvider.YOUTUBE]: new YouTubeProvider()
    })
    const enabled = ref<ClipProvider[]>([...DEFAULTS.enabled])

    const hasCachedData = computed(() => {
      return Object.values(providers.value).some((p) => p.hasCachedData)
    })

    const isModified = computed(() => {
      return (providers: Providers) => {
        return Object.values(ClipProvider).some(
          (p) => enabled.value.includes(p) !== providers.enabled.includes(p)
        )
      }
    })

    function update(providers: Providers) {
      enabled.value = providers.enabled
    }

    function purge() {
      for (const p of Object.values(providers.value)) {
        p.clearCache?.()
      }
    }

    async function getClip(url: string): Promise<Clip | undefined> {
      for (const ep of enabled.value) {
        const p = providers.value[ep]
        const c = await p?.getClip(url)
        if (c !== undefined) {
          return c
        }
      }
    }

    function getPlayerFormat(clip: Clip): PlayerFormat | undefined {
      if (!enabled.value.includes(clip.provider)) {
        return
      }
      const p = providers.value[clip.provider]
      return p?.getPlayerFormat(clip)
    }

    function getPlayerSource(clip: Clip): string | undefined {
      if (!enabled.value.includes(clip.provider)) {
        return
      }
      const p = providers.value[clip.provider]
      return p?.getPlayerSource(clip)
    }

    const $state = computed(() => ({
      providers: providers.value,
      enabled: enabled.value
    }))

    return {
      providers,
      enabled,
      hasCachedData,
      isModified,
      update,
      purge,
      getClip,
      getPlayerFormat,
      getPlayerSource,
      $state
    }
  },
  {
    persist: {
      key: 'providers',
      paths: ['enabled']
    }
  }
)
