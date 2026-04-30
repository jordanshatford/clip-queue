import { useStorage } from '@vueuse/core'

import type { Clip, PlayerFormat, IntegrationProvider } from '@/integrations/common'

import { env } from '@/config'
import { toStorageKey } from '@/integrations/common/utils'
import { IntegrationID } from '@/integrations/indentify'
import { getClips, getGames } from '@/integrations/twitch/core/api'
import { getClipIdFromUrl } from '@/integrations/twitch/core/utils'
import { Cacheable } from '@/types/cacheable'

const { CLIENT_ID } = env

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.TWITCH_CLIPS, 'enabled'), true)

/**
 * Provider for Twitch.tv clips.
 */
export class TwitchClipProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.TWITCH_CLIPS
  public readonly name: string = 'Twitch Clips'
  public readonly isExperimental: boolean = false

  public get isEnabled() {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  private token: () => string | Promise<string> = () => ''

  public constructor(token?: () => string | Promise<string>) {
    super()
    if (token) {
      this.token = token
    }
  }

  public hasClipSupport(url: string): boolean {
    return getClipIdFromUrl(url) !== undefined
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
      const clips = await getClips(CLIENT_ID, await this.token(), [id])
      const clip = clips[0]
      if (!clip) {
        throw new Error(`[${this.name}]: Clip not found for ID ${id}.`)
      }
      const games = await getGames(CLIENT_ID, await this.token(), [clip.game_id])
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
