import { useStorage } from '@vueuse/core'

import type { Clip, IntegrationProvider, PlayerConfig } from '../../core'

import { toStorageKey, Cacheable } from '../../core'
import { IntegrationID } from '../../indentify'
import { getOEmbed } from '../core/api'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.STREAMABLE, 'enabled'), false)

/**
 * Provider for Streamable.com content.
 */
export class StreamableProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.STREAMABLE
  public readonly name: string = 'Streamable'
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
      const endpoint = `https://api.streamable.com/oembed.json?url=https://streamable.com/${id}`
      const oembed = await getOEmbed(endpoint)
      const response: Clip = {
        id: id,
        url,
        title: oembed.title,
        channel: oembed.author_name ?? oembed.provider_name,
        embedUrl: `https://streamable.com/e/${id}`,
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

/**
 * Get the ID from a provided URL.
 * @param url - The URL of the video.
 * @returns The ID or undefined if the URL is not valid.
 */
function getIdFromURL(url: string): string | undefined {
  try {
    const uri = new URL(url)

    // Only accept valid Streamable URLs.
    if (!uri.hostname.endsWith('streamable.com')) {
      return
    }

    // Get the ID out of the URL. https://streamable.com/<ID>.
    const segments = uri.pathname.split('/').filter(Boolean)
    const id = segments.pop()
    return id
  } catch {
    return
  }
}
