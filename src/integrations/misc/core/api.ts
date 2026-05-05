import type { OEmbedResponse } from './types'

/**
 * Get a oembed details provided a URL.
 * @param url - The URL to send a GET request to.
 * @returns The video oembed details.
 * @throws Will throw an error if no video ID is provided or the fetch fails.
 */
export async function getOEmbed(url: string): Promise<OEmbedResponse> {
  if (url.length <= 0) {
    throw new Error('URL was not provided.')
  }
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch OEmbed with URL ${url}: ${response.statusText}`)
  }
  const data: OEmbedResponse = await response.json()
  return data
}
