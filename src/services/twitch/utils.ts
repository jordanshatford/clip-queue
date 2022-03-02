import type { Userstate } from "tmi.js"

const CLIP_HOSTNAMES = ["clips.twitch.tv"]
const TWITCH_HOSTNAME = "twitch.tv"
const CLIP_SUFFIX = "/clip/"

export function isModerator(userstate: Userstate): boolean {
  const isMod = userstate.mod
  const isBroadcaster = userstate.badges?.["broadcaster"] === "1"
  return isMod || isBroadcaster
}

export function isClipUrl(url: string): boolean {
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

export function getClipIdFromUrl(url: string): string | undefined {
  if (!isClipUrl(url)) {
    return undefined
  }
  try {
    const uri = new URL(url)
    const idStart = uri.pathname.lastIndexOf("/")
    return uri.pathname.slice(idStart).split("?")[0].slice(1)
  } catch {
    return undefined
  }
}

export default {
  isModerator,
  isClipUrl,
  getClipIdFromUrl,
}
