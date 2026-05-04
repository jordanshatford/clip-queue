import type { OEmbedResponse } from './types'

const BASE_URL = 'https://www.youtube.com/oembed'

/**
 * Get a YouTube oembed details by ID.
 * @param id - The YouTube video/shorts ID.
 * @returns The YouTube oembed details.
 * @throws Will throw an error if no video ID is provided or the fetch fails.
 */
export async function getYouTubeOEmbed(id: string): Promise<OEmbedResponse> {
  if (id.length <= 0) {
    throw new Error('ID was not provided.')
  }
  const response = await fetch(`${BASE_URL}?format=json&url=https://www.youtube.com/watch?v=${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch OEmbed with ID ${id}: ${response.statusText}`)
  }
  const data: OEmbedResponse = await response.json()
  return data
}
