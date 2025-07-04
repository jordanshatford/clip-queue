import type { KickClip } from './types'

export * from './types'

/**
 * Kick logo SVG as a string.
 */
export const logo = `
  <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1539.02 1539.02">
    <title>Kick</title>
    <defs>
      <style>
        .cls-1{fill:#53fc19;fill-rule:evenodd;}
      </style>
    </defs>
    <rect width="1539.02" height="1539.02"/>
    <polygon class="cls-1" points="278.26 216.86 646.7 216.86 646.7 462.48 769.51 462.48 769.51 339.67 892.32 339.67 892.32 216.86 1260.75 216.86 1260.75 585.29 1137.94 585.29 1137.94 708.1 1015.13 708.1 1015.13 830.91 1137.94 830.91 1137.94 953.72 1260.75 953.72 1260.75 1322.16 892.32 1322.16 892.32 1199.35 769.51 1199.35 769.51 1076.54 646.7 1076.54 646.7 1322.16 278.26 1322.16 278.26 216.86"/>
  </svg>
`

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
  logo,
  getClip,
  getClipIdFromUrl
}
