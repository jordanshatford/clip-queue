import type { KickClip } from '@cq/services/kick'
import kick from '@cq/services/kick'

import type { Clip, IClipProvider, PlayerFormat } from './types'
import { ClipProvider } from './types'

export class KickProvider implements IClipProvider {
  public name = ClipProvider.KICK

  public svg = kick.logo

  public isExperimental = false

  private cache: Record<string, KickClip> = {}

  public get hasCachedData(): boolean {
    return Object.keys(this.cache).length > 0
  }

  public clearCache(): void {
    this.cache = {}
  }

  public async getClip(url: string): Promise<Clip | undefined> {
    const id = kick.getClipIdFromUrl(url)
    if (!id) {
      return
    }
    let clip: KickClip | undefined = undefined
    if (id in this.cache) {
      clip = this.cache[id]
    } else {
      clip = await kick.getClip(id)
    }
    if (!clip) {
      return
    }
    this.cache[id] = clip
    const response: Clip = {
      id: clip.id,
      title: clip.title,
      channel: clip.channel.username,
      category: clip.category.name,
      createdAt: clip.created_at,
      url,
      embedUrl: clip.clip_url,
      thumbnailUrl: clip.thumbnail_url,
      provider: this.name,
      submitters: []
    }
    return response
  }

  public getPlayerFormat(): PlayerFormat | undefined {
    return 'video'
  }

  public getPlayerSource(clip: Clip): string | undefined {
    return clip.embedUrl
  }
}
