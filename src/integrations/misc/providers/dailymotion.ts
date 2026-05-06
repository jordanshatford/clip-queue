import { useStorage } from '@vueuse/core'

import type { Clip, IntegrationProvider, PlayerConfig } from '../../core'

import { toStorageKey, Cacheable } from '../../core'
import { IntegrationID } from '../../indentify'
import { getOEmbedProxied } from '../core/api'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.DAILYMOTION, 'enabled'), false)

/**
 * Provider for Dailymotion.com content.
 */
export class DailyMotionProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.DAILYMOTION
  public readonly name: string = 'Dailymotion'
  public readonly isExperimental: boolean = false

  public get isEnabled() {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  public hasClipSupport(url: string): boolean {
    return getIdFromURL(url) !== undefined
  }

  public async getClip(url: string): Promise<Clip> {
    const id = getIdFromURL(url)
    if (!id) {
      throw new Error(`[${this.name}]: Invalid video URL (${url}).`)
    }
    if (this.cache[id]) {
      return this.cache[id]
    }
    try {
      const endpoint = `https://www.dailymotion.com/services/oembed?url=https://www.dailymotion.com/video/${id}`
      const oembed = await getOEmbedProxied(endpoint)
      const response: Clip = {
        id: id,
        url,
        title: oembed.title,
        channel: oembed.author_name ?? oembed.provider_name,
        category: oembed.provider_name,
        embedUrl: `https://geo.dailymotion.com/player.html?video=${id}&`,
        thumbnailUrl: oembed.thumbnail_url,
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
      src: `${clip.embedUrl}?autoplay=true`,
      title: clip.title,
    }
  }
}

const SHORT_HOSTNAME = 'dai.ly'
const HOSTNAMES = ['dailymotion.com', 'www.dailymotion.com', SHORT_HOSTNAME]
/**
 * Get the ID from a provided URL.
 * @param url - The URL of the video.
 * @returns The ID or undefined if the URL is not valid.
 */
function getIdFromURL(url: string): string | undefined {
  try {
    const uri = new URL(url)

    // Only accept valid Dailymotion URLs.
    if (!HOSTNAMES.some((h) => uri.hostname.endsWith(h))) {
      return
    }

    // Get the ID out of the URL.
    //  1. https://dai.ly/<ID>
    //  2. https://www.dailymotion.com/video/<ID>
    if (uri.hostname === SHORT_HOSTNAME) {
      return uri.pathname.slice(1)
    }

    const segments = uri.pathname.split('/').filter(Boolean)
    const id = segments.pop()
    return id
  } catch {
    return
  }
}
