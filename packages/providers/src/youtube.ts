import youtube from '@cq/services/youtube'

import { BaseClipProvider, Clip, ClipProvider, PlayerFormat } from './types'

export class YouTubeProvider extends BaseClipProvider {
  public name = ClipProvider.YOUTUBE
  public svg = youtube.logo
  public override isExperimental = true

  public async getClip(url: string): Promise<Clip | undefined> {
    const id = youtube.getClipIdFromUrl(url)
    if (!id) {
      return
    }
    if (id in this.cache) {
      return this.cache[id]
    }
    const clip = await youtube.getClip(id)
    if (!clip) {
      return
    }
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
    this.cache[id] = response
    return response
  }

  public getPlayerFormat(): PlayerFormat | undefined {
    return 'iframe'
  }

  public getPlayerSource(clip: Clip): string | undefined {
    return `${clip.embedUrl}&autoplay=1&controls=1&loop=0&rel=0`
  }
}
