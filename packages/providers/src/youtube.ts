import type { YouTubeClip } from '@cq/services/youtube'
import youtube from '@cq/services/youtube'

import type { Clip, IClipProvider, PlayerFormat } from './types'
import { ClipProvider } from './types'

export class YouTubeProvider implements IClipProvider {
  public name = ClipProvider.YOUTUBE

  public svg = youtube.logo

  public isExperimental = true

  private cache: Record<string, YouTubeClip> = {}

  public get hasCachedData(): boolean {
    return Object.keys(this.cache).length > 0
  }

  public clearCache(): void {
    this.cache = {}
  }

  public async getClip(url: string): Promise<Clip | undefined> {
    const id = youtube.getClipIdFromUrl(url)
    if (!id) {
      return
    }
    let clip: YouTubeClip | undefined = undefined
    if (id in this.cache) {
      clip = this.cache[id]
    } else {
      clip = await youtube.getClip(id)
    }
    if (!clip) {
      return
    }
    this.cache[id] = clip

    const embedUrl = `https://www.youtube.com/embed/${clip.video_id}?start=${clip.start}&end=${clip.end}`

    const response: Clip = {
      id: clip.id,
      title: clip.title,
      channel: clip.author_name,
      category: undefined,
      createdAt: undefined,
      url: clip.url,
      embedUrl,
      thumbnailUrl: clip.thumbnail_url,
      provider: this.name,
      submitters: []
    }
    return response
  }

  public getPlayerFormat(): PlayerFormat | undefined {
    return 'iframe'
  }

  public getPlayerSource(clip: Clip): string | undefined {
    return `${clip.embedUrl}&autoplay=1&controls=1&loop=0&rel=0`
  }
}
