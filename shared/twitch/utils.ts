/**
 * List of known Twitch hostnames that these integrations support.
 */
const TWITCH_HOSTNAMES: string[] = [
  // NOTE: The clips.twitch.tv hostname appears to be deprecated and will
  //       forward all links to twitch.tv/channel/clip_id. There is no harm
  //       to continue to allow these links as the ID of the clip has not
  //       changed so the API will still provide details.
  'clips.twitch.tv',
  'm.twitch.tv',
  'twitch.tv',
  'www.twitch.tv',
]

/**
 * Check if a URL is a supported Twitch.tv URL.
 * @param url - The URL to check.
 * @returns true if it is a Twitch URL, false otherwise.
 */
export function isTwitchURL(url: URL): boolean {
  return TWITCH_HOSTNAMES.includes(url.hostname)
}
