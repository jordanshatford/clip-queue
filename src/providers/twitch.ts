import twitch, { type TwitchGame, type TwitchClip } from '@/services/twitch'
import { ClipProvider, type Clip, type IClipProvider, type PlayerFormat } from '@/providers/common'
import { useUser } from '@/stores/user'

export class TwitchProvider implements IClipProvider {
  public name = ClipProvider.TWITCH

  private clipsCache: Record<string, TwitchClip> = {}
  private gamesCache: Record<string, TwitchGame> = {}

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
      const user = useUser()
      const clips = await twitch.getClips(user.ctx, [id])
      clip = clips[0]
    }
    if (!clip) {
      return
    }
    let game: TwitchGame | undefined = undefined
    if (clip.game_id in this.gamesCache) {
      game = this.gamesCache[clip.game_id]
    } else {
      const user = useUser()
      const games = await twitch.getGames(user.ctx, [clip.game_id])
      game = games[0]
    }
    this.clipsCache[id] = clip
    this.gamesCache[clip.game_id] = game
    const response: Clip = {
      id: clip.id,
      title: clip.title,
      channel: clip.broadcaster_name,
      category: game.name,
      createdAt: clip.created_at,
      url,
      embedUrl: clip.embed_url,
      thumbnailUrl: clip.thumbnail_url,
      provider: ClipProvider.TWITCH,
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

export const twitchProvider = new TwitchProvider()
