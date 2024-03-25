import type { Clip } from './types'

// Return a UUID from a given clip.
export function toUUID(clip: Clip): string {
  return `${clip.provider.toString()}:${clip.id}`
}
