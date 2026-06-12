import type { TwitchAPI } from '#shared/twitch'

import { isTwitchURL } from '#shared/twitch'

import type { Clip, PlayerConfig } from '../core'

import { AbstractIntegrationProvider } from '../core'
import { IntegrationID } from '../indentify'

/**
 * Provider for Twitch.tv clips.
 */
export class TwitchClipProvider extends AbstractIntegrationProvider {
  public constructor(private readonly api: TwitchAPI) {
    super(IntegrationID.TWITCH_CLIPS, 'Twitch Clips', true)
  }

  public override get isMisconfigured(): boolean {
    return this.api.isMisconfigued
  }

  public hasSupportForUrl(url: string): boolean {
    return getClipIdFromUrl(url) !== undefined
  }

  public async resolveUrl(url: string): Promise<Clip> {
    const id = getClipIdFromUrl(url)
    if (!id) {
      throw new Error(`Invalid URL: ${url}.`)
    }
    return this.cache.cached(id, async (): Promise<Clip> => {
      const clip = await this.api.getClip(id)
      const game = await this.api.getGame(clip.game_id)
      return {
        id: clip.id,
        title: clip.title,
        channel: clip.broadcaster_name,
        category: game.name,
        createdAt: clip.created_at,
        url,
        embedUrl: clip.embed_url,
        thumbnailUrl: clip.thumbnail_url,
        provider: this.id,
        submitters: [],
      }
    })
  }

  public getPlayerConfigForClip(clip: Clip): PlayerConfig {
    const url = new URL(clip.embedUrl)
    url.searchParams.append('parent', window.location.hostname)
    url.searchParams.append('autoplay', 'true')
    url.searchParams.append('muted', 'false')
    return {
      type: 'iframe',
      src: url.toString(),
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
