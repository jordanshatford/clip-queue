import type { KickChatSender } from './pusher'

/**
 * List of known Kick hostnames that these integrations support.
 */
const KICK_HOSTNAMES: string[] = ['kick.com', 'www.kick.com']

/**
 * Check if a URL is a supported kick.com URL.
 * @param url - The URL to check.
 * @returns true if it is a Kick URL, false otherwise.
 */
export function isKickURL(url: URL): boolean {
  return KICK_HOSTNAMES.includes(url.hostname)
}

/**
 * Sleep for a provided time. The promise resolves after that duration.
 * @param milliseconds - The time in milliseconds to sleep.
 * @returns A promise that resolves after the duration.
 */
export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

/**
 * Check if a Kick message sender is a moderator.
 * @param sender - The sender of the message.
 * @returns True if the user has moderation priveledges, false otherwise.
 */
export function isSenderModerator(sender: Pick<KickChatSender, 'identity'>): boolean {
  return sender.identity.badges.some((badge) => ['broadcaster', 'moderator'].includes(badge.type))
}

/**
 * Check if a Kick message sender is a bot.
 * @param sender - The sender of the message.
 * @returns True if the user is a bot, false otherwise.
 */
export function isSenderBot(sender: Pick<KickChatSender, 'identity'>): boolean {
  return sender.identity.badges.some((badge) => badge.type === 'bot')
}
