import type { Clip } from './types'

/**
 * Get a UUID for the provided clip.
 * @param clip - A clip.
 * @returns {string} - UUID of the clip.
 */
export function toClipUUID(clip: Clip): string {
  return `${clip.provider.toString().toLowerCase()}:${clip.id}`
}
