import type { OEmbedResponse } from './types'

/**
 * Get the embed src using the HTML entry returned from the OEmbed API.
 * @param oembed - The OEmbed to get the HTML src from.
 * @returns The src specified in the HTML iframe.
 */
export function toEmbedUrl(oembed: OEmbedResponse): string {
  const match = oembed.html.match(/src="([^"]+)"/)
  return match?.[1] ?? ''
}
