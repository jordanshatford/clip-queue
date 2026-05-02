import { useStorage } from '@vueuse/core'

import { env } from '@/config'

import type { Clip, PlayerFormat, IntegrationProvider } from '../../core'

import { toStorageKey, Cacheable } from '../../core'
import { IntegrationID } from '../../indentify'
import { getVideos } from '../core/api'
import { isTwitchURL } from '../core/utils'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.TWITCH_VODS, 'enabled'), false)

/**
 * Provider for Twitch.tv videos.
 */
export class TwitchVodProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.TWITCH_VODS
  public readonly name: string = 'Twitch Videos'
  public readonly isExperimental: boolean = false

  public get isEnabled() {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  private token: () => string | Promise<string>

  public constructor(token: () => string | Promise<string>) {
    super()
    this.token = token
  }

  public hasClipSupport(url: string): boolean {
    const [id] = getVodIdAndTimestampFromUrl(url)
    return id !== undefined
  }

  public async getClip(url: string): Promise<Clip> {
    const [id, timestamp] = getVodIdAndTimestampFromUrl(url)
    if (!id) {
      throw new Error(`[${this.name}]: Invalid VOD URL (${url}).`)
    }
    if (this.cache[id]) {
      return this.cache[id]
    }
    try {
      const videos = await getVideos(env.CLIENT_ID, await this.token(), [id])
      const video = videos[0]
      if (!video) {
        throw new Error(`[${this.name}]: VOD not found for ID ${id}.`)
      }
      let category = `Video (${video.duration})`
      if (timestamp) {
        category = `Video (${video.duration} at ${timestamp})`
      }
      const response: Clip = {
        id: video.id,
        title: video.title,
        channel: video.user_name,
        category,
        createdAt: video.created_at,
        url,
        embedUrl: `https://player.twitch.tv/?video=${video.id}`,
        thumbnailUrl: video.thumbnail_url?.replace('%{width}x%{height}', '480x272'),
        provider: this.id,
        submitters: [],
        metadata: {
          start: timestamp,
        },
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
    const base = `${clip.embedUrl}&autoplay=true&parent=${window.location.hostname}`
    // Include timestamp in the player source if available.
    const timestamp = clip.metadata?.['start']
    if (timestamp && typeof timestamp === 'string') {
      return `${base}&time=${timestamp}`
    }
    return base
  }
}

const VIDEO_PATH_SUFFIXS = ['/videos/', '/video/', '/v/']
const VIDEO_TIMESTAMP_PARAM = 't'
/**
 * Get a vod ID from a provided URL.
 * @param url - The URL of the vod.
 * @returns The vod ID or undefined if the URL is not valid.
 */
function getVodIdAndTimestampFromUrl(url: string): [string | undefined, string | undefined] {
  try {
    const uri = new URL(url)

    // Only accept valid Twitch URLs.
    if (!isTwitchURL(uri)) {
      return [undefined, undefined]
    }

    // Verify the formats of vod URLs provided by Twitch:
    //  1. https://www.twitch.tv/<CHANNEL>/v/<ID>
    //  2. https://www.twitch.tv/<CHANNEL>/video/<ID>
    //  3. https://www.twitch.tv/videos/<ID>
    // Any of the above URLs can have a ?t=<TIMESTAMP> search parameter.
    if (!VIDEO_PATH_SUFFIXS.some((suffix) => uri.pathname.includes(suffix))) {
      return [undefined, undefined]
    }

    // Get the ID out of the URL. Always at the end of the URL.
    const idStart = uri.pathname.lastIndexOf('/')
    const id = uri.pathname.slice(idStart).split('?')[0]?.slice(1)
    const timestamp = uri.searchParams.get(VIDEO_TIMESTAMP_PARAM)
    return [id, timestamp ?? undefined]
  } catch {
    return [undefined, undefined]
  }
}
