import { useStorage } from '@vueuse/core'

import type { Clip, PlayerFormat, IntegrationProvider } from '../core'

import { toStorageKey, Cacheable } from '../core'
import { IntegrationID } from '../indentify'
import kick from './core'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.KICK_CLIPS, 'enabled'), true)

/**
 * Provider for Kick.com clips.
 */
export class KickClipsProvider extends Cacheable<Clip> implements IntegrationProvider {
  public readonly id: IntegrationID = IntegrationID.KICK_CLIPS
  public readonly name: string = 'Kick Clips'
  public readonly isExperimental: boolean = false

  public get isEnabled() {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  public hasClipSupport(url: string): boolean {
    const id = kick.getClipIdFromUrl(url)
    return id !== undefined
  }

  public async getClip(url: string): Promise<Clip> {
    const id = kick.getClipIdFromUrl(url)
    if (!id) {
      throw new Error(`[${this.name}]: Invalid clip URL (${url}).`)
    }
    if (this.cache[id]) {
      return this.cache[id]
    }
    try {
      const clip = await kick.getClip(id)
      const response: Clip = {
        id: clip.id,
        title: clip.title,
        channel: clip.channel.username,
        creator: clip.creator.username,
        category: clip.category.name,
        createdAt: clip.created_at,
        url,
        embedUrl: clip.clip_url,
        thumbnailUrl: clip.thumbnail_url,
        provider: this.id,
        submitters: [],
      }
      this.cache[id] = response
      return response
    } catch (error) {
      throw new Error(`[${this.name}]: ${error}`)
    }
  }

  public getPlayerFormat(): PlayerFormat {
    return 'video'
  }

  public getPlayerSource(clip: Clip): string {
    return clip.embedUrl
  }
}
