import { useStorage } from '@vueuse/core'

import type { Clip, IntegrationProvider, PlayerConfig } from '../../core'
import type { OEmbedResponse } from '../core/types'

import { toStorageKey, Cacheable } from '../../core'
import { IntegrationID } from '../../indentify'
import { getOEmbedProxied } from '../core/api'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.MEDAL, 'enabled'), false)

/**
 * Provider for Medal.tv content.
 */
export class MedalProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.MEDAL
  public readonly name: string = 'Medal'
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
      const endpoint = `https://medal.tv/api/oembed?url=https://medal.tv/clips/${id}`
      const oembed: OEmbedResponse = await getOEmbedProxied(endpoint)
      const response: Clip = {
        id: id,
        url,
        title: oembed.title,
        channel: oembed.author_name ?? this.name,
        category: this.name,
        embedUrl: `https://medal.tv/clips/${id}`,
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
      src: `${clip.embedUrl}?autoplay=1`,
      title: clip.title,
    }
  }
}

const GAMES_PATH_SUFFIX = '/games/'
const CLIPS_PATH_SUFFIX = '/clips/'
/**
 * Get the ID from a provided URL.
 * @param url - The URL of the video.
 * @returns The ID or undefined if the URL is not valid.
 */
function getIdFromURL(url: string): string | undefined {
  try {
    const uri = new URL(url)

    // Only accept valid Medal URLs.
    if (!['medal.tv', 'www.medal.tv'].includes(uri.hostname)) {
      return
    }

    if (!uri.pathname.includes(CLIPS_PATH_SUFFIX)) {
      return
    }

    // Get the ID out of the URL.
    //  1. https://medal.tv/clips/<ID>
    //  2. https://medal.tv/games/<GAME>/clips/<ID>
    const segments = uri.pathname.split('/').filter(Boolean)
    if (segments.length < 2 || (uri.pathname.includes(GAMES_PATH_SUFFIX) && segments.length < 4)) {
      return
    }
    const id = segments.pop()
    return id
  } catch {
    return
  }
}
