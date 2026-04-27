import { useStorage } from '@vueuse/core'

import type { Clip, PlayerFormat } from '@/integrations'

import { IntegrationProviderID, type IntegrationProvider } from '@/integrations/common/provider'
import { Cacheable } from '@/types/cacheable'

import { key } from '../common'
import kick from './core'

/**
 * The Kick provider.
 */
export class KickProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationProviderID = IntegrationProviderID.KICK_CLIPS
  public readonly name: string = 'Kick Clips'
  public readonly isExperimental: boolean = false

  public isEnabled = useStorage<boolean>(key(this, 'enabled'), true)

  public hasClipSupport(url: string): boolean {
    const id = kick.getClipIdFromUrl(url)
    return id !== undefined
  }

  public async getClip(url: string): Promise<Clip> {
    const id = kick.getClipIdFromUrl(url)
    if (!id) {
      throw new Error(`[${this.name}]: Invalid clip URL (${url}).`)
    }
    if (this.cache[id]) {
      return this.cache[id]
    }
    try {
      const clip = await kick.getClip(id)
      const response: Clip = {
        id: clip.id,
        title: clip.title,
        channel: clip.channel.username,
        creator: clip.creator.username,
        category: clip.category.name,
        createdAt: clip.created_at,
        url,
        embedUrl: clip.clip_url,
        thumbnailUrl: clip.thumbnail_url,
        provider: this.id,
        submitters: [],
      }
      this.cache[id] = response
      return response
    } catch (error) {
      throw new Error(`[${this.name}]: ${error}`)
    }
  }

  public getPlayerFormat(): PlayerFormat {
    return 'video'
  }

  public getPlayerSource(clip: Clip): string {
    return clip.embedUrl
  }
}
