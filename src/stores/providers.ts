import { defineStore } from 'pinia'
import {
  KickProvider,
  TwitchProvider,
  type Clip,
  type PlayerFormat,
  type IClipProvider,
  ClipProvider
} from '@/providers'

export const DEFAULTS = [ClipProvider.KICK, ClipProvider.TWITCH]

export interface Providers {
  providers: Record<ClipProvider, IClipProvider>
  enabledProviders: ClipProvider[]
}

export const useProviders = defineStore('providers', {
  persist: {
    key: 'providers-cache'
  },
  state: (): Providers => ({
    providers: {
      [ClipProvider.KICK]: new KickProvider(),
      [ClipProvider.TWITCH]: new TwitchProvider()
    },
    enabledProviders: [...DEFAULTS]
  }),
  getters: {
    hasCachedData: (state) => {
      return Object.values(state.providers).some((p) => p.hasCachedData)
    }
  },
  actions: {
    purge() {
      for (const p of Object.values(this.providers)) {
        p.clearCache?.()
      }
    },
    async getClip(url: string): Promise<Clip | undefined> {
      for (const ep of this.enabledProviders) {
        const p = this.providers[ep]
        const c = await p.getClip(url)
        if (c !== undefined) {
          return c
        }
      }
    },
    getPlayerFormat(clip: Clip): PlayerFormat | undefined {
      if (!this.enabledProviders.includes(clip.provider)) {
        return
      }
      const p = this.providers[clip.provider]
      return p?.getPlayerFormat(clip)
    },
    getPlayerSource(clip: Clip): string | undefined {
      if (!this.enabledProviders.includes(clip.provider)) {
        return
      }
      const p = this.providers[clip.provider]
      return p?.getPlayerSource(clip)
    }
  }
})
