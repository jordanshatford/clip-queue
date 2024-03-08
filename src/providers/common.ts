export enum ClipProvider {
  KICK = 'Kick',
  TWITCH = 'Twitch'
}

export type PlayerFormat = 'iframe' | 'video' | 'unknown'

// NOTE: provider and id together make a unique value.
export interface Clip {
  provider: ClipProvider
  submitters: string[]
  id: string
  title?: string
  channel?: string
  category?: string
  createdAt?: string
  url?: string
  embedUrl?: string
  thumbnailUrl?: string
}

export interface IClipProvider {
  name: ClipProvider
  // Cache related. We may or may not want to implement caching for each provider.
  hasCachedData?: boolean
  clearCache?: () => void
  // Functionality used for getting clip information.
  getClip(url: string): Promise<Clip | undefined>
  // Player related. Used to determine how to show the clip.
  getPlayerFormat: (clip: Clip) => PlayerFormat | undefined
  getPlayerSource: (clip: Clip) => string | undefined
}

// Return a UUID from a given clip.
export function toUUID(clip: Clip): string {
  return `${clip.provider.toString()}:${clip.id}`
}
