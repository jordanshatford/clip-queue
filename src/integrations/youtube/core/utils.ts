const YOUTUBE_HOSTNAME = 'youtube.com'
const VIDEO_ALT_HOSTNAME = 'youtu.be'

/**
 * List of known YouTube hostnames that these integrations support.
 */
const YOUTUBE_HOSTNAMES: string[] = [YOUTUBE_HOSTNAME, VIDEO_ALT_HOSTNAME]

/**
 * Check if a URL is a supported YouTube.com URL.
 * @param url - The URL to check.
 * @returns true if it is a YouTube URL, false otherwise.
 */
export function isYouTubeURL(url: URL): boolean {
  return YOUTUBE_HOSTNAMES.some((n) => url.hostname.endsWith(n))
}

const SHORT_PATH_SUFFIX = 'shorts'
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
    if (!isYouTubeURL(uri)) {
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
      const idStart = uri.pathname.lastIndexOf('/')
      const id = uri.pathname.slice(idStart).split('?')[0]?.slice(1)
      return { type: 'short', id }
    }

    const timestamp = uri.searchParams.get(VIDEO_TIMESTAMP_PARAM) ?? undefined

    // Handle the different formats of YouTube video URLs.
    if (uri.hostname === VIDEO_ALT_HOSTNAME) {
      const idStart = uri.pathname.lastIndexOf('/')
      const id = uri.pathname.slice(idStart).split('?')[0]?.slice(1)
      return { type: 'video', id, timestamp }
    } else if (uri.hostname.endsWith(YOUTUBE_HOSTNAME)) {
      const id = uri.searchParams.get('v') ?? undefined
      return { type: 'video', id, timestamp }
    }

    return {}
  } catch {
    return {}
  }
}
