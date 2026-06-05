import type {
  TwitchClip,
  TwitchGame,
  TwitchPagedResponse,
  TwitchResponse,
  TwitchVideo,
} from './types'

import { toURLParams } from './utils'

const BASE_URL = 'https://api.twitch.tv/helix'

/**
 * Convert common details to the headers expected by Twitch.
 * @param clientID - The client ID to use.
 * @param token - The users Twitch token.
 * @returns The common headers.
 */
export function toCommonHeaders(clientID: string, token: string): Record<string, string> {
  return {
    'Client-ID': clientID,
    Authorization: `Bearer ${token}`,
  }
}

/**
 * Get videos from Twitch.
 * @param clientID - The client ID to use.
 * @param token - The users Twitch token.
 * @param ids - The vidoe IDs to fetch.
 * @returns The videos.
 * @throws Will throw an error if no video IDs are provided or the fetch fails.
 */
export async function getVideos(
  clientID: string,
  token: string,
  ids: string[],
): Promise<TwitchVideo[]> {
  if (ids.length <= 0) {
    throw new Error('Video IDs were not provided.')
  }
  const result = await $fetch<TwitchPagedResponse<TwitchVideo[]>>(`${BASE_URL}/videos`, {
    query: toURLParams('id', ids),
    headers: toCommonHeaders(clientID, token),
  })
  return result.data
}

/**
 * Get clips from Twitch.
 * @param clientID - The client ID to use.
 * @param token - The users Twitch token.
 * @param ids - The clip IDs to fetch.
 * @returns The clips.
 * @throws Will throw an error if no clip IDs are provided or the fetch fails.
 */
export async function getClips(
  clientID: string,
  token: string,
  ids: string[],
): Promise<TwitchClip[]> {
  if (ids.length <= 0) {
    throw new Error('Clip IDs were not provided.')
  }
  const result = await $fetch<TwitchPagedResponse<TwitchClip[]>>(`${BASE_URL}/clips`, {
    query: toURLParams('id', ids),
    headers: toCommonHeaders(clientID, token),
  })
  return result.data
}

/**
 * Get games from Twitch.
 * @param clientID - The client ID to use.
 * @param token - The users Twitch token.
 * @param ids - The game IDs to fetch.
 * @returns The games.
 */
export async function getGames(
  clientID: string,
  token: string,
  ids: string[],
): Promise<TwitchGame[]> {
  if (ids.length <= 0) {
    throw new Error('Game IDs were not provided.')
  }
  const result = await $fetch<TwitchResponse<TwitchGame[]>>(`${BASE_URL}/games`, {
    query: toURLParams('id', ids),
    headers: toCommonHeaders(clientID, token),
  })
  return result.data
}
