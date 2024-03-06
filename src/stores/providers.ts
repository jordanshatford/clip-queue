import { defineStore } from 'pinia'
import {
  KickProvider,
  TwitchProvider,
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

export const useProviders = defineStore('providers', {
  persist: {
    key: 'providers',
    paths: ['enabled']
  },
  state: (): Providers => ({
    providers: {
      [ClipProvider.KICK]: new KickProvider(),
      [ClipProvider.TWITCH]: new TwitchProvider()
    },
    enabled: [...DEFAULTS.enabled]
  }),
  getters: {
    hasCachedData: (state) => {
      return Object.values(state.providers).some((p) => p.hasCachedData)
    },
    isModified: (state) => {
      return (providers: Providers) => {
        return Object.values(ClipProvider).some(
          (p) => state.enabled.includes(p) !== providers.enabled.includes(p)
        )
      }
    }
  },
  actions: {
    update(providers: Providers) {
      this.enabled = providers.enabled
    },
    purge() {
      for (const p of Object.values(this.providers)) {
        p.clearCache?.()
      }
    },
    async getClip(url: string): Promise<Clip | undefined> {
      for (const ep of this.enabled) {
        const p = this.providers[ep]
        const c = await p?.getClip(url)
        if (c !== undefined) {
          return c
        }
      }
    },
    getPlayerFormat(clip: Clip): PlayerFormat | undefined {
      if (!this.enabled.includes(clip.provider)) {
        return
      }
      const p = this.providers[clip.provider]
      return p?.getPlayerFormat(clip)
    },
    getPlayerSource(clip: Clip): string | undefined {
      if (!this.enabled.includes(clip.provider)) {
        return
      }
      const p = this.providers[clip.provider]
      return p?.getPlayerSource(clip)
    }
  }
})
