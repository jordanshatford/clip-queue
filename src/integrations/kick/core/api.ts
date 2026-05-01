import type { KickClip } from './types'

/**
 * Get a Kick clip by ID.
 * @param id - The Kick clip ID.
 * @returns The Kick clip.
 * @throws Will throw an error if no clip ID is provided or the fetch fails.
 */
export async function getClip(id: string): Promise<KickClip> {
  if (id.length <= 0) {
    throw new Error('Clip ID was not provided.')
  }
  const response = await fetch(`https://kick.com/api/v2/clips/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch clip with ID ${id}: ${response.statusText}.`)
  }
  const data: { clip: KickClip } = await response.json()
  return data.clip
}
