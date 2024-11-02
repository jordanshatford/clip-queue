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

const ALLOWED_KICK_CLIP_HOSTS = ['kick.com', 'www.kick.com']
const KICK_CLIP_PARAM_NAME = 'clip'

const api = axios.create({
  baseURL: 'https://kick.com/api/v2'
})

export async function getClip(id: string): Promise<KickClip | undefined> {
  if (id.length <= 0) {
    return
  }
  const { data } = await api.get<{ clip: KickClip }>(`clips/${id}`)
  return data.clip
}

export function getClipIdFromUrl(url: string): string | undefined {
  try {
    const uri = new URL(url)
    if (ALLOWED_KICK_CLIP_HOSTS.includes(uri.hostname)) {
      const id = uri.searchParams.get(KICK_CLIP_PARAM_NAME)
      if (id) {
        return id
      }
      if (uri.pathname.includes('/clips/')) {
        const idStart = uri.pathname.lastIndexOf('/')
        return uri.pathname.slice(idStart).split('?')[0]?.slice(1)
      }
    }
  } catch {
    return undefined
  }
}

export default {
  getClip,
  getClipIdFromUrl
}
