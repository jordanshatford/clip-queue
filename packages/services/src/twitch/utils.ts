import type { ChatUserstate } from 'tmi.js'

const CLIP_HOSTNAMES = ['clips.twitch.tv']
const TWITCH_HOSTNAME = 'twitch.tv'
const CLIP_SUFFIX = '/clip/'

/**
 * Check if a user is a moderator.
 * @param userstate - The userstate to check.
 * @returns True if the user is a moderator.
 */
export function isModerator(userstate: ChatUserstate): boolean {
  const isMod = userstate.mod
  const isBroadcaster = userstate.badges?.['broadcaster'] === '1'
  return isMod || isBroadcaster
}

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
  isModerator,
  getClipIdFromUrl
}
