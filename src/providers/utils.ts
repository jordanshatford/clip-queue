import type { Clip } from '@/integrations'

/**
 * Get a UUID for the provided clip.
 * @param clip - A clip.
 * @returns UUID of the clip.
 */
export function toClipUUID(clip: Clip): string {
  return `${clip.provider.toString().toLowerCase()}:${clip.id.toLowerCase()}`
}
