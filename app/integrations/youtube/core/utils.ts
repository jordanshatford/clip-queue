import { isSupportedProviderURL, OEmbedProviderName } from '#shared/oembed'

const VIDEO_ALT_HOSTNAME = 'youtu.be'
const SHORT_PATH_SUFFIX = '/shorts/'
const VIDEO_TIMESTAMP_PARAM = 't'
/**
 * Get YouTube URL details.
 * @param url - The URL of the video or short.
 * @returns Information about the URL like ID, timestamp, type.
 */
export function getYouTubeUrlDetails(url: string): {
  type?: 'video' | 'short'
  id?: string
  timestamp?: string
} {
  try {
    const uri = new URL(url)

    // Only accept valid YouTube URLs.
    if (!isSupportedProviderURL(OEmbedProviderName.YOUTUBE, uri)) {
      return {}
    }

    // Verify the URL is either a YouTube video or short URL.
    //  1. https://www.youtube.com/shorts/<ID>
    //  2. https://www.youtube.com/watch?v=<ID>
    //  3. https://www.youtube.com/watch?v=<ID>&t=<TIMESTAMP>
    //  4. https://youtu.be/<ID>
    //  5. https://youtu.be/<ID>?t=<TIMESTAMP>

    // Handle if it is a YouTube short URL.
    if (uri.pathname.includes(SHORT_PATH_SUFFIX)) {
      const segments = uri.pathname.split('/').filter(Boolean)
      if (segments.length < 2) {
        return {}
      }
      const id = segments.pop()
      return { type: 'short', id }
    }

    const timestamp = uri.searchParams.get(VIDEO_TIMESTAMP_PARAM) ?? undefined

    // Handle the different formats of YouTube video URLs.
    if (uri.hostname === VIDEO_ALT_HOSTNAME) {
      const segments = uri.pathname.split('/').filter(Boolean)
      const id = segments.pop()
      return { type: 'video', id, timestamp }
    }

    const id = uri.searchParams.get('v') ?? undefined
    return { type: 'video', id, timestamp }
  } catch {
    return {}
  }
}
