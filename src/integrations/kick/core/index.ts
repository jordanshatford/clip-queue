import type { KickClip } from './types'

export * from './types'

const ALLOWED_KICK_CLIP_HOSTS = ['kick.com', 'www.kick.com']
const KICK_CLIP_PARAM_NAME = 'clip'

/**
 * Get a Kick clip by ID.
 * @param id - The Kick clip ID.
 * @returns The Kick clip.
 * @throws Will throw an error if no clip ID is provided or the fetch fails.
 */
export async function getClip(id: string): Promise<KickClip> {
  if (id.length <= 0) {
    throw new Error('Clip ID was not provided.')
  }
  const response = await fetch(`https://kick.com/api/v2/clips/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch clip with ID ${id}: ${response.statusText}.`)
  }
  const data: { clip: KickClip } = await response.json()
  return data.clip
}

/**
 * Get a clip ID from a Kick clip URL.
 * @param url - The Kick clip URL.
 * @returns The clip ID or undefined if the URL is invalid.
 */
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
    return
  } catch {
    return
  }
}

export default {
  getClip,
  getClipIdFromUrl,
}
