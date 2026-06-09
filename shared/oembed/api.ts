import type { OEmbedResponse, OEmbedVideoResponse } from './types'

import { CacheMap } from '../utils/cache'
import { resolveOEmbedProvider } from './providers'

/**
 * Class used for interacting with various OEmbed API's.
 *
 * It internally handles caching results in memory.
 */
export class OEmbedAPI {
  private readonly cache: CacheMap<OEmbedVideoResponse> = new CacheMap()

  /**
   * Get a oembed details provided a URL.
   * @param url - The URL to send a GET request to.
   * @returns The video oembed details.
   * @throws Will throw an error if no video ID is provided or the fetch fails.
   */
  public async getOEmbed(url: string): Promise<OEmbedVideoResponse> {
    if (!url) {
      throw new Error('URL was not provided.')
    }
    return this.cache.cached(url, async (): Promise<OEmbedVideoResponse> => {
      const provider = resolveOEmbedProvider(url)
      const external = new URL(provider.endpoint)
      external.searchParams.set('url', url)
      let oembed: OEmbedResponse
      if (provider.proxied) {
        // Proxy the request to ensure we bypass CORS issues present on some OEmbed providers.
        oembed = await $fetch('/api/oembed/proxy', { query: { url: external.toString() } })
      } else {
        oembed = await $fetch<OEmbedResponse>(external.toString())
      }
      // Ensure we only allow video OEmbeds.
      if (oembed.type !== 'video') {
        throw new Error(`OEmbed is not a video for URL: ${url}.`)
      }
      return oembed
    })
  }
}
