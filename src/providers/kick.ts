import kick, { type KickClip } from '@/services/kick'
import { ClipProvider, type Clip, type IClipProvider, type PlayerFormat } from '@/providers/common'

export class KickProvider implements IClipProvider {
  public name = ClipProvider.KICK

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
      provider: ClipProvider.KICK,
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
