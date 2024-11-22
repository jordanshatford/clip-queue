import type { TwitchClip, TwitchGame } from '@cq/services/twitch'
import twitch from '@cq/services/twitch'

import type { Clip, ClipProviderCtxCallback, IClipProvider, PlayerFormat } from './types'
import { ClipProvider } from './types'

export class TwitchProvider implements IClipProvider {
  public name = ClipProvider.TWITCH

  public svg = twitch.logo

  public isExperimental = false

  private clipsCache: Record<string, TwitchClip> = {}
  private gamesCache: Record<string, TwitchGame> = {}

  private ctx: ClipProviderCtxCallback = () => ({ id: '' })

  public constructor(cb?: ClipProviderCtxCallback) {
    if (cb) {
      this.ctx = cb
    }
  }

  public get hasCachedData(): boolean {
    return Object.keys(this.clipsCache).length > 0 || Object.keys(this.gamesCache).length > 0
  }

  public clearCache(): void {
    this.clipsCache = {}
    this.gamesCache = {}
  }

  public async getClip(url: string): Promise<Clip | undefined> {
    const id = twitch.getClipIdFromUrl(url)
    if (!id) {
      return
    }
    let clip: TwitchClip | undefined = undefined
    if (id in this.clipsCache) {
      clip = this.clipsCache[id]
    } else {
      const clips = await twitch.getClips(await this.ctx(), [id])
      clip = clips[0]
    }
    if (!clip) {
      return
    }
    let game: TwitchGame | undefined = undefined
    if (clip.game_id in this.gamesCache) {
      game = this.gamesCache[clip.game_id]
    } else {
      const games = await twitch.getGames(await this.ctx(), [clip.game_id])
      game = games[0]
    }
    this.clipsCache[id] = clip
    if (game) {
      this.gamesCache[clip.game_id] = game
    }
    const response: Clip = {
      id: clip.id,
      title: clip.title,
      channel: clip.broadcaster_name,
      category: game?.name,
      createdAt: clip.created_at,
      url,
      embedUrl: clip.embed_url,
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
    return `${clip.embedUrl}&autoplay=true&parent=${window.location.hostname}`
  }
}
