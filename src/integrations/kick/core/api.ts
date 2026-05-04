import type { KickClip, KickVideo } from './types'

const BASE_URL = 'https://kick.com/api'

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
  const response = await fetch(`${BASE_URL}/v2/clips/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch clip with ID ${id}: ${response.statusText}.`)
  }
  const data: { clip: KickClip } = await response.json()
  return data.clip
}

/**
 * Get a Kick video by ID.
 * @param id - The Kick video ID.
 * @returns The Kick video.
 * @throws Will throw an error if no video ID is provided or the fetch fails.
 */
export async function getVideo(id: string): Promise<KickVideo> {
  if (id.length <= 0) {
    throw new Error('Video ID was not provided.')
  }
  const response = await fetch(`${BASE_URL}/v1/video/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch video with ID ${id}: ${response.statusText}.`)
  }
  const data: KickVideo = await response.json()
  return data
}
