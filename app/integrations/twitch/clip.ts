import { useStorage } from '@vueuse/core'

import {
  IntegrationStatus,
  type AuthenticationDetails,
  type Clip,
  type IntegrationProvider,
  type PlayerConfig,
} from '../core'
import { toStorageKey, Cacheable } from '../core'
import { IntegrationID } from '../indentify'
import { getClips, getGames } from './core/api'
import { isTwitchURL } from './core/utils'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.TWITCH_CLIPS, 'enabled'), true)

/**
 * Provider for Twitch.tv clips.
 */
export class TwitchClipProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.TWITCH_CLIPS
  public readonly name: string = 'Twitch Clips'

  public get isEnabled(): boolean {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  public get status(): IntegrationStatus | undefined {
    const auth = this.authentication()
    if (!auth.clientId || !auth.accessToken) {
      return IntegrationStatus.MISCONFIGURED
    }
  }

  private authentication: () => AuthenticationDetails

  public constructor(authentication: () => AuthenticationDetails) {
    super()
    this.authentication = authentication
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
      const auth = this.authentication()
      const clips = await getClips(auth.clientId, auth.accessToken, [id])
      const clip = clips[0]
      if (!clip) {
        throw new Error(`[${this.name}]: Clip not found for ID ${id}.`)
      }
      const games = await getGames(auth.clientId, auth.accessToken, [clip.game_id])
      const response: Clip = {
        id: clip.id,
        title: clip.title,
        channel: clip.broadcaster_name,
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

  public getPlayerConfig(clip: Clip): PlayerConfig {
    return {
      type: 'iframe',
      src: `${clip.embedUrl}&autoplay=true&parent=${window.location.hostname}`,
      title: clip.title,
    }
  }
}

const MOBILE_HOSTNAME = 'm.twitch.tv'
const DEPRECATED_CLIP_HOSTNAME = 'clips.twitch.tv'
const CLIP_PATH_SUFFIX = '/clip/'
/**
 * Get a clip ID from a provided URL.
 * @param url - The URL of the clip.
 * @returns The clip ID or undefined if the URL is not valid.
 */
function getClipIdFromUrl(url: string): string | undefined {
  try {
    const uri = new URL(url)

    // Only accept valid Twitch URLs.
    if (!isTwitchURL(uri)) {
      return
    }

    // Verify the two formats of clip URLs provided by Twitch:
    //  1. https://clips.twitch.tv/<ID>
    //  2. https://www.twitch.tv/<CHANNEL>/clip/<ID>
    if (uri.hostname !== DEPRECATED_CLIP_HOSTNAME && !uri.pathname.includes(CLIP_PATH_SUFFIX)) {
      return
    }

    // Get the ID out of the URL. Always at the end of the URL.
    const segments = uri.pathname.split('/').filter(Boolean)
    if (
      ![MOBILE_HOSTNAME, DEPRECATED_CLIP_HOSTNAME].includes(uri.hostname) &&
      segments.length < 3
    ) {
      return
    }
    return segments.pop()
  } catch {
    return
  }
}
