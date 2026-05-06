import { useStorage } from '@vueuse/core'

import type { Clip, IntegrationProvider, PlayerConfig } from '../../core'

import { toStorageKey, Cacheable } from '../../core'
import { IntegrationID } from '../../indentify'
import { getOEmbed } from '../core/api'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.SOOP, 'enabled'), false)

/**
 * Provider for Sooplive.com content.
 */
export class SoopProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.SOOP
  public readonly name: string = 'Soop'
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
    const { id, timestamp } = getDetailsFromURL(url)
    if (!id) {
      throw new Error(`[${this.name}]: Invalid video URL (${url}).`)
    }
    if (this.cache[id]) {
      return this.cache[id]
    }
    try {
      const endpoint = `https://openapi.sooplive.com/oembed/embedinfo?url=https://vod.sooplive.com/player/${id}`
      const oembed = await getOEmbed(endpoint)
      const response: Clip = {
        id: id,
        url,
        title: oembed.title,
        channel: oembed.author_name ?? oembed.provider_name,
        category: oembed.provider_name,
        embedUrl: `https://vod.sooplive.com/player/${id}/embed`,
        thumbnailUrl: oembed.thumbnail_url ?? '',
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
    let src = `${clip.embedUrl}?autoPlay=true`
    const timestamp = clip.metadata?.['start']
    if (timestamp && typeof timestamp === 'string') {
      src = `${src}&change_second=${timestamp}`
    }
    return {
      type: 'iframe',
      src,
      title: clip.title,
    }
  }
}

const VIDEO_TIMESTAMP_PARAM = 'change_second'
/**
 * Get the details from a provided URL.
 * @param url - The URL of the video.
 * @returns The details (id, timestamp) from the URL.
 */
function getDetailsFromURL(url: string): { id?: string; timestamp?: string } {
  try {
    const uri = new URL(url)

    // Only accept valid Soop URLs.
    if (!(uri.hostname === 'vod.sooplive.com')) {
      return {}
    }

    // Get the ID out of the URL.
    //  1. https://vod.sooplive.com/player/<ID>.
    //  2. https://vod.sooplive.com/player/<ID>?change_second=<TIMESTAMP>
    const segments = uri.pathname.split('/').filter(Boolean)
    const id = segments.pop()

    const timestamp = uri.searchParams.get(VIDEO_TIMESTAMP_PARAM) ?? undefined

    return { id, timestamp }
  } catch {
    return {}
  }
}
