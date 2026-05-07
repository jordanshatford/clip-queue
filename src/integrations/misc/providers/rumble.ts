import { useStorage } from '@vueuse/core'

import type { Clip, IntegrationProvider, PlayerConfig } from '../../core'
import type { OEmbedResponse } from '../core/types'

import { toStorageKey, Cacheable } from '../../core'
import { IntegrationID } from '../../indentify'
import { getOEmbedProxied } from '../core/api'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.RUMBLE, 'enabled'), false)

/**
 * Provider for Rumble.com videos and shorts.
 */
export class RumbleProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.RUMBLE
  public readonly name: string = 'Rumble'
  public readonly isExperimental: boolean = false

  public get isEnabled() {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  public hasClipSupport(url: string): boolean {
    const { id } = getDetailsFromUrl(url)
    return id !== undefined
  }

  public async getClip(url: string): Promise<Clip> {
    const { id, timestamp } = getDetailsFromUrl(url)
    if (!id) {
      throw new Error(`[${this.name}]: Invalid video URL (${url}).`)
    }
    if (this.cache[id]) {
      return this.cache[id]
    }
    try {
      const endpoint = `https://rumble.com/api/Media/oembed?url=${url}`
      const oembed = await getOEmbedProxied(endpoint)
      const response: Clip = {
        id: id,
        url,
        title: oembed.title,
        channel: oembed.author_name ?? this.name,
        category: this.name,
        embedUrl: toEmbedUrl(oembed),
        thumbnailUrl: oembed.thumbnail_url,
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
    let src = `${clip.embedUrl}?autoplay=2`
    const timestamp = clip.metadata?.['start']
    if (timestamp && typeof timestamp === 'string') {
      src = `${src}&start=${timestamp}`
    }
    return {
      type: 'iframe',
      src,
      title: clip.title,
    }
  }
}

const SHORT_PATH_SUFFIX = '/shorts/'
const EMBED_PATH_SUFFIX = '/embed/'
const TIMESTAMP_PARAM = 'start'
/**
 * Get details from a provided URL.
 * @param url - The URL of the vod.
 * @returns The details (id, timestamp) from the URL.
 */
function getDetailsFromUrl(url: string): { id?: string; timestamp?: string } {
  try {
    const uri = new URL(url)

    // Only accept valid Rumble URLs.
    if (!['rumble.com', 'www.rumble.com'].includes(uri.hostname)) {
      return {}
    }

    const segments = uri.pathname.split('/').filter(Boolean)

    // Get the ID out of the URL.
    //  1. https://rumble.com/shorts/<ID>
    //  2. https://rumble.com/embed/<ID>/
    //  3. https://rumble.com/embed/<ID>/?start=<TIMESTAMP>
    //  4. https://rumble.com/<ID>-<NAME>.html
    //  5. https://rumble.com/<ID>-<NAME>.html?start=<TIMESTAMP>
    if (uri.pathname.startsWith(SHORT_PATH_SUFFIX)) {
      if (segments.length < 2) {
        return {}
      }
      const id = segments.pop()
      return { id }
    }

    const timestamp = uri.searchParams.get(TIMESTAMP_PARAM) ?? undefined
    if (uri.pathname.startsWith(EMBED_PATH_SUFFIX)) {
      if (segments.length < 2) {
        return {}
      }
      const id = segments.pop()
      return { id, timestamp }
    }

    if (!uri.pathname.endsWith('.html')) {
      return {}
    }

    const id = segments.pop()
    return { id, timestamp }
  } catch {
    return {}
  }
}

/**
 * Get the embed src using the HTML entry returned from the OEmbed API.
 * @param oembed - The OEmbed to get the HTML src from.
 * @returns The src specified in the HTML iframe.
 */
function toEmbedUrl(oembed: OEmbedResponse): string {
  const match = oembed.html.match(/src="([^"]+)"/)
  return match?.[1] ?? ''
}
