import axios from 'axios'
import type { TwitchGame, TwitchClip, TwitchUserCtx } from './types'

const BASE_URL = 'https://api.twitch.tv/helix'

export function commonHeaders(ctx: TwitchUserCtx) {
  return {
    'Client-ID': ctx.id,
    Authorization: `Bearer ${ctx.token}`
  }
}

export async function getClips(ctx: TwitchUserCtx, ids: string[]): Promise<TwitchClip[]> {
  if (ids.length <= 0) {
    return []
  }
  const { data } = await axios.get<{ data: TwitchClip[] }>(
    `${BASE_URL}/clips?id=${ids.join('&id=')}`,
    {
      headers: commonHeaders(ctx)
    }
  )
  return data.data
}

export async function getGames(ctx: TwitchUserCtx, ids: string[]): Promise<TwitchGame[]> {
  if (ids.length <= 0) {
    return []
  }
  const { data } = await axios.get<{ data: TwitchGame[] }>(
    `${BASE_URL}/games?id=${ids.join('&id=')}`,
    {
      headers: commonHeaders(ctx)
    }
  )
  return data.data
}

export default {
  getClips,
  getGames
}
