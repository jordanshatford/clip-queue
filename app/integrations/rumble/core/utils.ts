import { isSupportedProviderURL, OEmbedProviderName } from '#shared/oembed'

const SHORT_PATH_SUFFIX = '/shorts/'
const EMBED_PATH_SUFFIX = '/embed/'
const TIMESTAMP_PARAM = 'start'
/**
 * Get details from a provided URL.
 * @param url - The URL of the vod.
 * @returns The details (id, timestamp) from the URL.
 */
export function getRumbleUrlDetails(url: string): {
  type?: 'video' | 'short'
  id?: string
  timestamp?: string
} {
  try {
    const uri = new URL(url)

    // Only accept valid Rumble URLs.
    if (!isSupportedProviderURL(OEmbedProviderName.RUMBLE, uri)) {
      return {}
    }

    const segments = uri.pathname.split('/').filter(Boolean)

    // Get the ID out of the URL.
    //  1. https://rumble.com/shorts/<ID>
    //  2. https://rumble.com/embed/<ID>/
    //  3. https://rumble.com/embed/<ID>/?start=<TIMESTAMP>
    //  4. https://rumble.com/<ID>-<NAME>.html
    //  5. https://rumble.com/<ID>-<NAME>.html?start=<TIMESTAMP>
    if (uri.pathname.startsWith(SHORT_PATH_SUFFIX)) {
      if (segments.length < 2) {
        return {}
      }
      const id = segments.pop()
      return { type: 'short', id }
    }

    const timestamp = uri.searchParams.get(TIMESTAMP_PARAM) ?? undefined
    if (uri.pathname.startsWith(EMBED_PATH_SUFFIX)) {
      if (segments.length < 2) {
        return {}
      }
      const id = segments.pop()
      return { type: 'video', id, timestamp }
    }

    if (!uri.pathname.endsWith('.html')) {
      return {}
    }

    const id = segments.pop()
    return { type: 'video', id, timestamp }
  } catch {
    return {}
  }
}
