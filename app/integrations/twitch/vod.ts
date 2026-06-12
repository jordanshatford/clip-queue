import type { TwitchAPI } from '#shared/twitch'

import { isTwitchURL } from '#shared/twitch'

import type { Clip, PlayerConfig } from '../core'

import { AbstractIntegrationProvider } from '../core'
import { IntegrationID } from '../indentify'

/**
 * Provider for Twitch.tv videos.
 */
export class TwitchVodProvider extends AbstractIntegrationProvider {
  public constructor(private readonly api: TwitchAPI) {
    super(IntegrationID.TWITCH_VODS, 'Twitch Videos', false)
  }

  public override get isMisconfigured(): boolean {
    return this.api.isMisconfigued
  }

  public hasSupportForUrl(url: string): boolean {
    const { id } = getVodIdAndTimestampFromUrl(url)
    return id !== undefined
  }

  public async resolveUrl(url: string): Promise<Clip> {
    const { id, timestamp } = getVodIdAndTimestampFromUrl(url)
    if (!id) {
      throw new Error(`Invalid URL: ${url}.`)
    }
    return this.cache.cached(id, async (): Promise<Clip> => {
      const video = await this.api.getVideo(id)
      let category = `Video (${video.duration})`
      if (timestamp) {
        category = `Video (${video.duration} at ${timestamp})`
      }
      return {
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
    })
  }

  public getPlayerConfigForClip(clip: Clip): PlayerConfig {
    const url = new URL(clip.embedUrl)
    url.searchParams.append('parent', window.location.hostname)
    url.searchParams.append('autoplay', 'true')
    url.searchParams.append('muted', 'false')
    // Include timestamp in the player source if available.
    const timestamp = clip.metadata?.['start']
    if (timestamp && typeof timestamp === 'string') {
      url.searchParams.append('time', timestamp)
    }
    return {
      type: 'iframe',
      src: url.toString(),
      title: clip.title,
    }
  }
}

const VIDEOS_PATH_SUFFIX = '/videos/'
const VIDEO_PATH_SUFFIXS = ['/video/', '/v/']
const VIDEO_TIMESTAMP_PARAM = 't'
/**
 * Get a vod ID from a provided URL.
 * @param url - The URL of the vod.
 * @returns The vod ID or undefined if the URL is not valid.
 */
function getVodIdAndTimestampFromUrl(url: string): { id?: string; timestamp?: string } {
  try {
    const uri = new URL(url)

    // Only accept valid Twitch URLs.
    if (!isTwitchURL(uri)) {
      return {}
    }

    // Verify the formats of vod URLs provided by Twitch:
    //  1. https://www.twitch.tv/<CHANNEL>/v/<ID>
    //  2. https://www.twitch.tv/<CHANNEL>/video/<ID>
    //  3. https://www.twitch.tv/videos/<ID>
    // Any of the above URLs can have a ?t=<TIMESTAMP> search parameter.
    if (
      !uri.pathname.includes(VIDEOS_PATH_SUFFIX) &&
      !VIDEO_PATH_SUFFIXS.some((suffix) => uri.pathname.includes(suffix))
    ) {
      return {}
    }

    // Get the ID out of the URL. Always at the end of the URL.
    const segments = uri.pathname.split('/').filter(Boolean)
    if (
      (uri.pathname.includes(VIDEOS_PATH_SUFFIX) && segments.length < 2) ||
      (VIDEO_PATH_SUFFIXS.some((suffix) => uri.pathname.includes(suffix)) && segments.length < 3)
    ) {
      return {}
    }
    const id = segments.pop()
    const timestamp = uri.searchParams.get(VIDEO_TIMESTAMP_PARAM)
    return { id, timestamp: timestamp ?? undefined }
  } catch {
    return {}
  }
}
