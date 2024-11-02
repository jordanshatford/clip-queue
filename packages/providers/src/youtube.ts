import type { YouTubeClip } from '@cq/services/youtube'
import youtube from '@cq/services/youtube'

import type { Clip, IClipProvider, PlayerFormat } from './types'
import { ClipProvider } from './types'

export class YouTubeProvider implements IClipProvider {
  public name = ClipProvider.YOUTUBE

  public svg = `
    <svg viewBox="0 0 28.57 20" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <title>YouTube</title>
      <g>
        <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"></path>
        <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"></path>
      </g>
    </svg>
  `

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
