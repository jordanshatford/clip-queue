import twitch, { type TwitchGame, type TwitchClip } from '@/services/twitch'
import { ClipProvider, type Clip, type IClipProvider, type PlayerFormat } from '@/providers/common'
import { useUser } from '@/stores/user'

export class TwitchProvider implements IClipProvider {
  public name = ClipProvider.TWITCH

  public svg = `
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 2400 2800" style="enable-background:new 0 0 2400 2800;" xml:space="preserve">
      <title>Twitch</title>
      <style type="text/css">
        .st0{fill:#FFFFFF;}
        .st1{fill:#9146FF;}
      </style>
      <g>
        <polygon class="st0" points="2200,1300 1800,1700 1400,1700 1050,2050 1050,1700 600,1700 600,200 2200,200 	"/>
        <g>
          <g id="Layer_1-2">
            <path class="st1" d="M500,0L0,500v1800h600v500l500-500h400l900-900V0H500z M2200,1300l-400,400h-400l-350,350v-350H600V200h1600 V1300z"/>
            <rect x="1700" y="550" class="st1" width="200" height="600"/>
            <rect x="1150" y="550" class="st1" width="200" height="600"/>
          </g>
        </g>
      </g>
    </svg>
  `

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
