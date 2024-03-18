import axios from 'axios'

export interface YouTubeClipLookupResponseItem {
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

export interface YouTubeClipLookupResponse {
  kind: string
  etag: string
  items: YouTubeClipLookupResponseItem[]
}

export interface YouTubeOEmbedResponse {
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

const ALLOWED_YOUTUBE_CLIP_HOSTS = ['youtube.com']
const YOUTUBE_CLIP_SUFFIX = '/clip/'

const operationalApi = axios.create({ baseURL: 'https://yt.lemnoslife.com' })
const api = axios.create({ baseURL: 'https://www.youtube.com' })

export async function getClip(id: string): Promise<YouTubeClip | undefined> {
  if (id.length <= 0) {
    return
  }

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
}

export function isClipUrl(url: string): boolean {
  try {
    const uri = new URL(url)
    if (ALLOWED_YOUTUBE_CLIP_HOSTS.includes(uri.hostname)) {
      if (uri.pathname.includes(YOUTUBE_CLIP_SUFFIX)) {
        return true
      }
    }
    return false
  } catch {
    return false
  }
}

export function getClipIdFromUrl(url: string): string | undefined {
  if (!isClipUrl(url)) {
    return undefined
  }
  try {
    const uri = new URL(url)
    const idStart = uri.pathname.lastIndexOf('/')
    return uri.pathname.slice(idStart).split('?')[0].slice(1)
  } catch {
    return undefined
  }
}

export default {
  getClip,
  isClipUrl,
  getClipIdFromUrl
}
