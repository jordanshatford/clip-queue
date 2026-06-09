import type { OEmbedVideoResponse } from '#shared/oembed'

/**
 * Parse the HTML value for the iFrame embed source.
 * @param oembed - The OEmbed.
 * @returns The src specified in the HTML iFrame.
 */
export function parseEmbedURLFromHTML(oembed: OEmbedVideoResponse): string {
  const match = oembed.html.match(/src="([^"]+)"/)
  return match?.[1] ?? ''
}
