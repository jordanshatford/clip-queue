import type { OEmbedProviderName } from './providers'
import type { OEmbedVideoResponse } from './types'

import { SUPPORTED_PROVIDERS } from './providers'

/**
 * Parse the HTML value for the iFrame embed source.
 * @param oembed - The OEmbed.
 * @returns The src specified in the HTML iFrame.
 */
export function parseEmbedURLFromHTML(oembed: OEmbedVideoResponse): string {
  const match = oembed.html.match(/src="([^"]+)"/)
  return match?.[1] ?? ''
}

/**
 * Check if a URL is a supported URL for a given provider.
 * @param name - The name of the provider.
 * @param url - The URL to check.
 * @returns true if it is a URL for the provider and the provider is supported, false otherwise.
 */
export function isSupportedProviderURL(name: OEmbedProviderName, url: URL): boolean {
  const provider = SUPPORTED_PROVIDERS.find((p) => p.name.toLowerCase() === name.toLowerCase())
  if (!provider) {
    return false
  }
  return provider.hostnames.includes(url.hostname)
}
