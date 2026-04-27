/**
 * Twitch logo SVG as a string.
 */
export const logo = `
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 2400 2800" style="enable-background:new 0 0 2400 2800;" xml:space="preserve">
    <title>Twitch</title>
    <style type="text/css">
      .st0{fill:#FFFFFF;}
      .st1{fill:#9146FF;}
    </style>
    <g>
      <polygon class="st0" points="2200,1300 1800,1700 1400,1700 1050,2050 1050,1700 600,1700 600,200 2200,200 	"/>
      <g>
        <g id="Layer_1-2">
          <path class="st1" d="M500,0L0,500v1800h600v500l500-500h400l900-900V0H500z M2200,1300l-400,400h-400l-350,350v-350H600V200h1600 V1300z"/>
          <rect x="1700" y="550" class="st1" width="200" height="600"/>
          <rect x="1150" y="550" class="st1" width="200" height="600"/>
        </g>
      </g>
    </g>
  </svg>
`

const CLIP_HOSTNAMES = ['clips.twitch.tv']
const TWITCH_HOSTNAME = 'twitch.tv'
const CLIP_SUFFIX = '/clip/'

/**
 * Check if a URL is a Twitch clip URL.
 * @param url - The URL to check.
 * @returns True if the URL is a Twitch clip URL.
 */
function isClipUrl(url: string): boolean {
  try {
    const uri = new URL(url)
    if (CLIP_HOSTNAMES.includes(uri.hostname)) {
      return true
    }
    if (uri.hostname.endsWith(TWITCH_HOSTNAME)) {
      if (uri.pathname.includes(CLIP_SUFFIX)) {
        return true
      }
    }
    return false
  } catch {
    return false
  }
}

/**
 * Get a clip ID from a Twitch clip URL.
 * @param url - The Twitch clip URL.
 * @returns The clip ID or undefined if the URL is invalid.
 */
export function getClipIdFromUrl(url: string): string | undefined {
  if (!isClipUrl(url)) {
    return
  }
  try {
    const uri = new URL(url)
    const idStart = uri.pathname.lastIndexOf('/')
    return uri.pathname.slice(idStart).split('?')[0]?.slice(1)
  } catch {
    return
  }
}

/**
 * Convert a key and values to URLSearchParams.
 * @param key - The key to use in the URLSearchParams.
 * @param values - The values to append to the URLSearchParams.
 * @returns The URLSearchParams.
 */
export function toURLParams(key: string, values: string[]): URLSearchParams {
  const params = new URLSearchParams()
  values.forEach((v) => params.append(key, v))
  return params
}

export default {
  getClipIdFromUrl,
}
