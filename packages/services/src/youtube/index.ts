import type { YouTubeClip, YouTubeClipLookupResponse, YouTubeOEmbedResponse } from './types'

export type { YouTubeClip } from './types'

/**
 * YouTube logo SVG as a string.
 */
export const logo = `
  <svg viewBox="0 0 28.57 20" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <title>YouTube</title>
    <g>
      <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"></path>
      <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"></path>
    </g>
  </svg>
`

const ALLOWED_YOUTUBE_CLIP_HOSTS = ['youtube.com', 'www.youtube.com']
const YOUTUBE_CLIP_SUFFIX = '/clip/'

/**
 * Get a YouTube clip by ID.
 * @param id - The YouTube clip ID.
 * @returns The YouTube clip or undefined if the clip was not found.
 */
export async function getClip(id: string): Promise<YouTubeClip | undefined> {
  if (id.length <= 0) {
    return
  }

  try {
    // Fetch video ID, start and end times from lookup server. YouTube does not provide this functionality.
    const response = await fetch(`https://yt.lemnoslife.com/videos?part=id,clip&clipId=${id}`)
    const data: YouTubeClipLookupResponse = await response.json()
    const item = data.items[0]

    if (item && item.videoId !== null && item.clip) {
      const videoId = item.videoId
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
      const videoDataResponse = await fetch(
        `https://www.youtube.com/oembed?url=${videoUrl}&format=json`
      )
      const videoData: YouTubeOEmbedResponse = await videoDataResponse.json()
      return {
        id,
        url: `https://www.youtube.com/clip/${id}`,
        video_id: videoId,
        video_url: videoUrl,
        title: item.clip.title,
        author_name: videoData.author_name,
        thumbnail_url: videoData.thumbnail_url,
        start: Math.floor(item.clip.startTimeMs / 1000),
        end: Math.ceil(item.clip.endTimeMs / 1000)
      }
    }
    return
  } catch (e) {
    console.error('Failed to fetch YouTube clip: ', id, e)
    return
  }
}

/**
 * Get a clip ID from a YouTube clip URL.
 * @param url - The YouTube clip URL.
 * @returns The clip ID or undefined if the URL is invalid.
 */
export function getClipIdFromUrl(url: string): string | undefined {
  try {
    const uri = new URL(url)
    if (ALLOWED_YOUTUBE_CLIP_HOSTS.includes(uri.hostname)) {
      if (uri.pathname.includes(YOUTUBE_CLIP_SUFFIX)) {
        const idStart = uri.pathname.lastIndexOf('/')
        return uri.pathname.slice(idStart).split('?')?.[0]?.slice(1)
      }
    }
    return
  } catch {
    return
  }
}

export default {
  logo,
  getClip,
  getClipIdFromUrl
}
