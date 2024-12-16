import kick from '@cq/services/kick'

import { BaseClipProvider, Clip, ClipProvider, PlayerFormat } from './types'

export class KickProvider extends BaseClipProvider {
  public name = ClipProvider.KICK
  public svg = kick.logo

  public async getClip(url: string): Promise<Clip | undefined> {
    const id = kick.getClipIdFromUrl(url)
    if (!id) {
      return
    }
    if (id in this.cache) {
      return this.cache[id]
    }
    const clip = await kick.getClip(id)
    if (!clip) {
      return
    }
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
    this.cache[id] = response
    return response
  }

  public getPlayerFormat(): PlayerFormat {
    return 'video'
  }

  public getPlayerSource(clip: Clip): string {
    return clip.embedUrl
  }
}
