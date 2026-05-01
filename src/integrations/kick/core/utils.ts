/**
 * List of known Kick hostnames that these integrations support.
 */
const KICK_HOSTNAMES: string[] = ['kick.com']

/**
 * Check if a URL is a supported kick.com URL.
 * @param url - The URL to check.
 * @returns true if it is a Kick URL, false otherwise.
 */
export function isKickURL(url: URL): boolean {
  return KICK_HOSTNAMES.some((n) => url.hostname.endsWith(n))
}
