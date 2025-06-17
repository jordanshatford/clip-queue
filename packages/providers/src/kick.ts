import kick from '@cq/services/kick'

import type { Clip, PlayerFormat } from './types'
import { BaseClipProvider, ClipProvider } from './types'

/**
 * The Kick provider.
 */
export class KickProvider extends BaseClipProvider {
  public name = ClipProvider.KICK
  public svg = kick.logo

  public async getClip(url: string): Promise<Clip> {
    const id = kick.getClipIdFromUrl(url)
    console.error(id)
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
        submitters: []
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
