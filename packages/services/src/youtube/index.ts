import axios from 'axios'

interface YouTubeClipLookupResponseItem {
  kind: string
  etag: string
  id: string
  // If null, the video was not found.
  videoId: string | null
  clip?: {
    title: string
    startTimeMs: number
    endTimeMs: number
  }
}

interface YouTubeClipLookupResponse {
  kind: string
  etag: string
  items: YouTubeClipLookupResponseItem[]
}

interface YouTubeOEmbedResponse {
  title: string
  author_name: string
  author_url: string
  type: string
  height: number
  width: number
  version: string
  provider_name: string
  provider_url: string
  thumbnail_height: number
  thumbnail_width: number
  thumbnail_url: string
  html: string
}

export interface YouTubeClip {
  id: string
  url: string
  video_id: string
  video_url: string
  title: string
  author_name: string
  thumbnail_url: string
  start: number
  end: number
}

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

const operationalApi = axios.create({ baseURL: 'https://yt.lemnoslife.com' })
const api = axios.create({ baseURL: 'https://www.youtube.com' })

export async function getClip(id: string): Promise<YouTubeClip | undefined> {
  if (id.length <= 0) {
    return
  }

  try {
    // Fetch video ID, start and end times from lookup server. YouTube does not provide this functionality.
    const { data } = await operationalApi.get<YouTubeClipLookupResponse>('videos', {
      params: {
        part: 'id,clip',
        clipId: id
      }
    })

    const item = data.items[0]

    if (item && item.videoId !== null && item.clip) {
      const videoId = item.videoId
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
      const { data: videoData } = await api.get<YouTubeOEmbedResponse>('oembed', {
        params: {
          format: 'json',
          url: videoUrl
        }
      })

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
