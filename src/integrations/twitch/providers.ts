import { useStorage } from '@vueuse/core'

import { env } from '@/config'
import { Cacheable } from '@/types/cacheable'

import {
  type Clip,
  type PlayerFormat,
  type IntegrationProvider,
  IntegrationProviderID,
} from '../common/provider'
import { getClips, getGames } from './core/api'
import { getClipIdFromUrl } from './core/utils'

const { CLIENT_ID } = env

const isEnabled = useStorage<boolean>('__cqi_ttv-clips_enabled', true)

/**
 * The Twitch provider.
 */
export class TwitchProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationProviderID = IntegrationProviderID.TWITCH_CLIPS
  public readonly name: string = 'Twitch Clips'
  public readonly isExperimental: boolean = false

  public get isEnabled() {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  private ctx: () => string | Promise<string> = () => ''

  public constructor(callback?: () => string | Promise<string>) {
    super()
    if (callback) {
      this.ctx = callback
    }
  }

  public hasClipSupport(url: string): boolean {
    const id = getClipIdFromUrl(url)
    return id !== undefined
  }

  public async getClip(url: string): Promise<Clip> {
    const id = getClipIdFromUrl(url)
    if (!id) {
      throw new Error(`[${this.name}]: Invalid clip URL (${url}).`)
    }
    if (this.cache[id]) {
      return this.cache[id]
    }
    try {
      const clips = await getClips(CLIENT_ID, await this.ctx(), [id])
      const clip = clips[0]
      if (!clip) {
        throw new Error(`[${this.name}]: Clip not found for ID ${id}.`)
      }
      const games = await getGames(CLIENT_ID, await this.ctx(), [clip.game_id])
      const response: Clip = {
        id: clip.id,
        title: clip.title,
        channel: clip.broadcaster_name,
        creator: clip.creator_name,
        category: games[0]?.name,
        createdAt: clip.created_at,
        url,
        embedUrl: clip.embed_url,
        thumbnailUrl: clip.thumbnail_url,
        provider: this.id,
        submitters: [],
      }
      this.cache[id] = response
      return response
    } catch (error) {
      throw new Error(`[${this.name}]: ${error}`)
    }
  }

  public getPlayerFormat(): PlayerFormat {
    return 'iframe'
  }

  public getPlayerSource(clip: Clip): string {
    return `${clip.embedUrl}&autoplay=true&parent=${window.location.hostname}`
  }
}
