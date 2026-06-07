import { useStorage } from '@vueuse/core'

import type { Clip, IntegrationProvider, PlayerConfig } from '../core'

import { toStorageKey, Cacheable } from '../core'
import { IntegrationID } from '../indentify'
import { getClip } from './core/api'
import { isKickURL } from './core/utils'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.KICK_CLIPS, 'enabled'), true)

/**
 * Provider for Kick.com clips.
 */
export class KickClipsProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.KICK_CLIPS
  public readonly name: string = 'Kick Clips'

  public get isEnabled(): boolean {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  public hasClipSupport(url: string): boolean {
    return getClipIdFromUrl(url) !== undefined
  }

  public async getClip(url: string): Promise<Clip> {
    const id = getClipIdFromUrl(url)
    if (!id) {
      throw new Error(`Invalid URL: ${url}.`)
    }
    return this.cached(id, async (): Promise<Clip> => {
      const clip = await getClip(id)
      return {
        id: clip.id,
        title: clip.title,
        channel: clip.channel.username,
        category: clip.category.name,
        createdAt: clip.created_at,
        url,
        embedUrl: clip.clip_url,
        thumbnailUrl: clip.thumbnail_url,
        provider: this.id,
        submitters: [],
      }
    })
  }

  public getPlayerConfig(clip: Clip): PlayerConfig {
    return {
      type: 'video',
      src: clip.embedUrl,
      poster: clip.thumbnailUrl,
      title: clip.title,
    }
  }
}

const CLIP_PATH_PARAM = 'clip'
const CLIP_PATH_SUFFIXS = ['/clip/', '/clips']
/**
 * Get a clip ID from a provided URL.
 * @param url - The URL of the clip.
 * @returns The clip ID or undefined if the URL is not valid.
 */
function getClipIdFromUrl(url: string): string | undefined {
  try {
    const uri = new URL(url)

    // Only accept valid Kick URLs.
    if (!isKickURL(uri)) {
      return
    }

    // Verify the formats of clip URLs is valid for Kick:
    //  1. https://kick.com/<CHANNEL>?clip=<ID>
    //  2. https://kick.com/<CHANNEL>/clip/<ID>
    //  3. https://kick.com/<CHANNEL>/clips/<ID>
    const id = uri.searchParams.get(CLIP_PATH_PARAM)
    if (id) {
      return id
    }
    const segments = uri.pathname.split('/').filter(Boolean)
    if (CLIP_PATH_SUFFIXS.some((s) => uri.pathname.includes(s)) && segments.length >= 3) {
      return segments.pop()
    }
  } catch {
    return
  }
}
