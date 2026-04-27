import type { Clip, PlayerFormat } from '@/integrations'
import type { IntegrationProvider } from '@/integrations/common/provider'

import { ClipProvider } from '@/integrations'
import { Cacheable } from '@/types/cacheable'

import kick from './core'

/**
 * The Kick provider.
 */
export class KickProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id = 'kick-clips'
  public readonly name: ClipProvider = ClipProvider.KICK
  public readonly icon: string = kick.logo
  public readonly isExperimental: boolean = false

  public hasClipSupport(url: string): boolean {
    const id = kick.getClipIdFromUrl(url)
    return id !== undefined
  }

  public async getClip(url: string): Promise<Clip> {
    const id = kick.getClipIdFromUrl(url)
    if (!id) {
      throw new Error(`[${this.name}]: Invalid clip URL.`)
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
        provider: this.name,
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
