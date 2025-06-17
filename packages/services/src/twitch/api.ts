import type {
  TwitchClip,
  TwitchGame,
  TwitchPagedResponse,
  TwitchResponse,
  TwitchUser,
  TwitchUserCtx
} from './types'
import { toURLParams } from './utils'

const BASE_URL = 'https://api.twitch.tv/helix'

/**
 * Convert a Twitch user context to common headers.
 * @param ctx - The Twitch user context.
 * @returns The common headers.
 */
export function toCommonHeaders(ctx: TwitchUserCtx) {
  return {
    'Client-ID': ctx.id,
    Authorization: `Bearer ${ctx.token}`
  }
}

/**
 * Get clips from Twitch.
 * @param ctx - The Twitch user context.
 * @param ids - The clip IDs to fetch.
 * @returns The clips.
 * @throws Will throw an error if no clip IDs are provided or the fetch fails.
 */
export async function getClips(ctx: TwitchUserCtx, ids: string[]): Promise<TwitchClip[]> {
  if (ids.length <= 0) {
    throw new Error('Clip IDs were not provided.')
  }
  const response = await fetch(`${BASE_URL}/clips?${toURLParams('id', ids)}`, {
    headers: toCommonHeaders(ctx)
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch clips with IDs ${ids.join(' ')}: ${response.statusText}`)
  }
  const data: TwitchPagedResponse<TwitchClip[]> = await response.json()
  return data.data
}

/**
 * Get games from Twitch.
 * @param ctx - The Twitch user context.
 * @param ids - The game IDs to fetch.
 * @returns The games.
 */
export async function getGames(ctx: TwitchUserCtx, ids: string[]): Promise<TwitchGame[]> {
  if (ids.length <= 0) {
    throw new Error('Game IDs were not provided.')
  }
  const response = await fetch(`${BASE_URL}/games?${toURLParams('id', ids)}`, {
    headers: toCommonHeaders(ctx)
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch games with IDs ${ids.join(' ')}: ${response.statusText}`)
  }
  const data: TwitchResponse<TwitchGame[]> = await response.json()
  return data.data
}

/**
 * Get users from Twitch.
 * @param ctx - The Twitch user context.
 * @param ids - The user IDs to fetch.
 * @returns The users.
 */
export async function getUsers(ctx: TwitchUserCtx, ids: string[]): Promise<TwitchUser[]> {
  const response = await fetch(`${BASE_URL}/users?${toURLParams('id', ids)}`, {
    headers: toCommonHeaders(ctx)
  })
  if (!response.ok) {
    throw new Error(`Failed to users with IDs ${ids.join(' ')}: ${response.statusText}`)
  }
  const data: TwitchResponse<TwitchUser[]> = await response.json()
  return data.data
}

export default {
  getClips,
  getGames,
  getUsers
}
