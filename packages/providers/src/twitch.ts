import twitch from '@cq/services/twitch'

import type { Clip, ClipProviderCtxCallback, PlayerFormat } from './types'
import { BaseClipProvider, ClipProvider } from './types'

/**
 * The Twitch provider.
 */
export class TwitchProvider extends BaseClipProvider {
  public name = ClipProvider.TWITCH
  public svg = twitch.logo

  private ctx: ClipProviderCtxCallback = () => ({ id: '' })

  public constructor(callback?: ClipProviderCtxCallback) {
    super()
    if (callback) {
      this.ctx = callback
    }
  }

  public async getClip(url: string): Promise<Clip | undefined> {
    const id = twitch.getClipIdFromUrl(url)
    if (!id) {
      return
    }
    if (id in this.cache) {
      return this.cache[id]
    }
    const clips = await twitch.getClips(await this.ctx(), [id])
    const clip = clips[0]
    if (!clip) {
      return
    }
    const games = await twitch.getGames(await this.ctx(), [clip.game_id])
    const game = games[0]
    const response: Clip = {
      id: clip.id,
      title: clip.title,
      channel: clip.broadcaster_name,
      creator: clip.creator_name,
      category: game?.name,
      createdAt: clip.created_at,
      url,
      embedUrl: clip.embed_url,
      thumbnailUrl: clip.thumbnail_url,
      provider: this.name,
      submitters: []
    }
    this.cache[id] = response
    return response
  }

  public getPlayerFormat(): PlayerFormat {
    return 'iframe'
  }

  public getPlayerSource(clip: Clip): string {
    return `${clip.embedUrl}&autoplay=true&parent=${window.location.hostname}`
  }
}
