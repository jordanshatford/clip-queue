import type { KickClip } from '@cq/services/kick'
import kick from '@cq/services/kick'

import type { Clip, IClipProvider, PlayerFormat } from './types'
import { ClipProvider } from './types'

export class KickProvider implements IClipProvider {
  public name = ClipProvider.KICK

  public svg = `
    <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1539.02 1539.02">
      <title>Kick</title>
      <defs>
        <style>
          .cls-1{fill:#53fc19;fill-rule:evenodd;}
        </style>
      </defs>
      <rect width="1539.02" height="1539.02"/>
      <polygon class="cls-1" points="278.26 216.86 646.7 216.86 646.7 462.48 769.51 462.48 769.51 339.67 892.32 339.67 892.32 216.86 1260.75 216.86 1260.75 585.29 1137.94 585.29 1137.94 708.1 1015.13 708.1 1015.13 830.91 1137.94 830.91 1137.94 953.72 1260.75 953.72 1260.75 1322.16 892.32 1322.16 892.32 1199.35 769.51 1199.35 769.51 1076.54 646.7 1076.54 646.7 1322.16 278.26 1322.16 278.26 216.86"/>
    </svg>
  `

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
