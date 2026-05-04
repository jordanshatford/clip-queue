import { useStorage } from '@vueuse/core'

import type { Clip, IntegrationProvider, PlayerConfig } from '../../core'

import { toStorageKey, Cacheable } from '../../core'
import { IntegrationID } from '../../indentify'
import { getVideo } from '../core/api'
import { isKickURL } from '../core/utils'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.KICK_VODS, 'enabled'), false)

/**
 * Provider for Kick.com videos.
 */
export class KickVodProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.KICK_VODS
  public readonly name: string = 'Kick Videos'
  public readonly isExperimental: boolean = false

  public get isEnabled() {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  public hasClipSupport(url: string): boolean {
    const { id } = getVodIdAndTimestampFromUrl(url)
    return id !== undefined
  }

  public async getClip(url: string): Promise<Clip> {
    const { id, timestamp } = getVodIdAndTimestampFromUrl(url)
    if (!id) {
      throw new Error(`[${this.name}]: Invalid VOD URL (${url}).`)
    }
    if (this.cache[id]) {
      return this.cache[id]
    }
    try {
      const video = await getVideo(id)
      const duration = formatMilliseconds(video.livestream.duration)
      // When possible display the category provided by the API, otherwise just display that
      // it is a video.
      const c = video.livestream.categories[0]?.category.name ?? 'Video'
      let category = `${c} (${duration})`
      if (timestamp) {
        // Start timestamp is in seconds format.
        const start = formatMilliseconds(parseInt(timestamp) * 1000)
        category = `${c} (${duration} at ${start})`
      }
      // Attempt to get the thumbnail URL, fallback to displaying the channel profile picture
      // when a URL is not provided by the API.
      const thumbnailUrl =
        video.livestream.thumbnail ?? video.livestream.channel.user.profilepic ?? ''
      const response: Clip = {
        id: video.uuid,
        title: video.livestream.session_title,
        channel: video.livestream.channel.user.username,
        category,
        createdAt: video.created_at,
        url,
        embedUrl: video.source,
        thumbnailUrl,
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

  public getPlayerConfig(clip: Clip): PlayerConfig {
    const start = clip.metadata?.['start']
    return {
      type: 'video',
      src: clip.embedUrl,
      poster: clip.thumbnailUrl,
      title: clip.title,
      start: start ? parseInt(start as string) : undefined,
    }
  }
}

const VIDEO_PATH_SUFFIXS = ['/videos/']
const VIDEO_TIMESTAMP_PARAM = 't'
/**
 * Get a vod ID from a provided URL.
 * @param url - The URL of the vod.
 * @returns The vod ID or undefined if the URL is not valid.
 */
function getVodIdAndTimestampFromUrl(url: string): { id?: string; timestamp?: string } {
  try {
    const uri = new URL(url)

    // Only accept valid Kick URLs.
    if (!isKickURL(uri)) {
      return {}
    }

    // Verify the formats of vod URLs provided by Kick:
    //  1. https://www.kick.com/<CHANNEL>/videos/<ID>
    //  2. https://www.kick.com/<CHANNEL>/videos/<ID>?t=<TIMESTAMP>
    if (!VIDEO_PATH_SUFFIXS.some((suffix) => uri.pathname.includes(suffix))) {
      return {}
    }

    // Get the ID out of the URL. Always at the end of the URL.
    const idStart = uri.pathname.lastIndexOf('/')
    const id = uri.pathname.slice(idStart).split('?')[0]?.slice(1)
    const timestamp = uri.searchParams.get(VIDEO_TIMESTAMP_PARAM)
    return { id, timestamp: timestamp ?? undefined }
  } catch {
    return {}
  }
}

/**
 * Format milliseconds to hh:mm:ss for display in the user interface.
 * @param ms - The number of milliseconds.
 * @returns string representing the duration.
 */
function formatMilliseconds(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':')
}
