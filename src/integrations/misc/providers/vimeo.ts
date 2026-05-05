import { useStorage } from '@vueuse/core'

import type { Clip, IntegrationProvider, PlayerConfig } from '../../core'

import { toStorageKey, Cacheable } from '../../core'
import { IntegrationID } from '../../indentify'
import { getOEmbed } from '../core/api'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.VIMEO, 'enabled'), false)

/**
 * Provider for Vimeo.com content.
 */
export class VimeoProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.VIMEO
  public readonly name: string = 'Vimeo'
  public readonly isExperimental: boolean = false

  public get isEnabled() {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  public hasClipSupport(url: string): boolean {
    const { id } = getDetailsFromURL(url)
    return id !== undefined
  }

  public async getClip(url: string): Promise<Clip> {
    const { id, timestamp, end } = getDetailsFromURL(url)
    if (!id) {
      throw new Error(`[${this.name}]: Invalid video URL (${url}).`)
    }
    if (this.cache[id]) {
      return this.cache[id]
    }
    try {
      const endpoint = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`
      const oembed = await getOEmbed(endpoint)
      const response: Clip = {
        id: id,
        url,
        title: oembed.title,
        channel: oembed.author_name ?? oembed.provider_name,
        embedUrl: `https://player.vimeo.com/video/${id}`,
        thumbnailUrl: oembed.thumbnail_url,
        provider: this.id,
        submitters: [],
        metadata: {
          start: timestamp,
          end,
        },
      }
      this.cache[id] = response
      return response
    } catch (error) {
      throw new Error(`[${this.name}]: ${error}`)
    }
  }

  public getPlayerConfig(clip: Clip): PlayerConfig {
    let src = `${clip.embedUrl}#autoplay=true`
    const timestamp = clip.metadata?.['start']
    if (timestamp && typeof timestamp === 'string') {
      src = `${src}&t=${timestamp}`
    }
    const end = clip.metadata?.['end']
    if (end && typeof end === 'string') {
      src = `${src}&end=${end}`
    }
    return {
      type: 'iframe',
      src,
      title: clip.title,
    }
  }
}

const VIDEO_TIMESTAMP_PARAM = 't'
const VIDEO_END_TIMESTAMP_PARAM = 'end'
/**
 * Get the details from a provided URL.
 * @param url - The URL of the video.
 * @returns The details (id, start, end) from the URL.
 */
function getDetailsFromURL(url: string): { id?: string; timestamp?: string; end?: string } {
  try {
    const uri = new URL(url)

    // Only accept valid Vimeo URLs.
    if (!uri.hostname.includes('vimeo.com')) {
      return {}
    }

    // Get the ID out of the URL.
    //  1. https://vimeo.com/<ID>.
    //  2. https://vimeo.com/<ID>#t=<TIMESTAMP>
    //  3. https://vimeo.com/<ID>#t=<TIMESTAMP>&end=<TIMESTAMP_END>
    const segments = uri.pathname.split('/').filter(Boolean)
    const id = segments.pop()

    const params = new URLSearchParams(uri.hash.slice(1))
    const timestamp = params.get(VIDEO_TIMESTAMP_PARAM) ?? undefined
    const end = params.get(VIDEO_END_TIMESTAMP_PARAM) ?? undefined

    return { id, timestamp, end }
  } catch {
    return {}
  }
}
