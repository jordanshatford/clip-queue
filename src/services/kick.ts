import axios from 'axios'

export interface KickCategory {
  id: number
  name: string
  slug: string
  responsive: string
  banner: string
  parent_category: string
}

export interface KickChannel {
  id: number
  username: string
  slug: string
  profile_picture: string | null
}

export interface KickClip {
  id: string
  livestream_id: string
  category_id: string
  channel_id: number
  user_id: number
  title: string
  clip_url: string
  thumbnail_url: string
  privacy: string
  likes: number
  liked: boolean
  views: number
  duration: number
  started_at: string
  created_at: string
  is_mature: boolean
  video_url: string
  view_count: number
  likes_count: number
  category: KickCategory
  creator: KickChannel
  channel: KickChannel
}

const KICK_HOSTNAME = 'kick.com'
const KICK_CLIP_PARAM_NAME = 'clip'

const api = axios.create({
  baseURL: 'https://kick.com/api/v2'
})

export async function getClips(ids: string[]): Promise<KickClip[]> {
  if (ids.length <= 0) {
    return []
  }
  const clips: KickClip[] = []
  for (const id of ids) {
    try {
      const { data } = await api.get<{ clip: KickClip }>(`clips/${id}`)
      clips.push(data.clip)
    } catch (e) {
      continue
    }
  }
  return clips
}

export function isClipUrl(url: string): boolean {
  try {
    const uri = new URL(url)
    if (uri.hostname.endsWith(KICK_HOSTNAME)) {
      try {
        const uri = new URL(url)
        return uri.searchParams.get(KICK_CLIP_PARAM_NAME) !== null
      } catch {
        return false
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
    return uri.searchParams.get(KICK_CLIP_PARAM_NAME) ?? undefined
  } catch {
    return undefined
  }
}

export default {
  getClips,
  getClipIdFromUrl
}
