import type {
  TwitchClip,
  TwitchGame,
  TwitchPagedResponse,
  TwitchResponse,
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
 */
export async function getClips(ctx: TwitchUserCtx, ids: string[]): Promise<TwitchClip[]> {
  if (ids.length <= 0) {
    return []
  }
  try {
    const response = await fetch(`${BASE_URL}/clips?${toURLParams('id', ids)}`, {
      headers: toCommonHeaders(ctx)
    })
    const data: TwitchPagedResponse<TwitchClip[]> = await response.json()
    return data.data
  } catch (e) {
    console.error('Failed to fetch Twitch clips: ', ids, e)
  }
  return []
}

/**
 * Get games from Twitch.
 * @param ctx - The Twitch user context.
 * @param ids - The game IDs to fetch.
 * @returns The games.
 */
export async function getGames(ctx: TwitchUserCtx, ids: string[]): Promise<TwitchGame[]> {
  if (ids.length <= 0) {
    return []
  }
  try {
    const response = await fetch(`${BASE_URL}/games?${toURLParams('id', ids)}`, {
      headers: toCommonHeaders(ctx)
    })
    const data: TwitchResponse<TwitchGame[]> = await response.json()
    return data.data
  } catch (e) {
    console.error('Failed to fetch Twitch games: ', ids, e)
  }
  return []
}

export default {
  getClips,
  getGames
}
