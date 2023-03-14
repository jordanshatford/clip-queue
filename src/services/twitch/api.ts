import axios from 'axios'
import type { TwitchGame, TwitchClip, RequestCtx } from './types'

const BASE_URL = 'https://api.twitch.tv/helix'

export async function getClips(ctx: RequestCtx, ids: string[]): Promise<TwitchClip[]> {
  if (ids.length <= 0) {
    return []
  }
  const { data } = await axios.get<{ data: TwitchClip[] }>(
    `${BASE_URL}/clips?id=${ids.join('&id=')}`,
    {
      headers: {
        'Client-ID': ctx.id,
        Authorization: `Bearer ${ctx.token}`
      }
    }
  )
  return data.data
}

export async function getGames(ctx: RequestCtx, ids: string[]): Promise<TwitchGame[]> {
  if (ids.length <= 0) {
    return []
  }
  const { data } = await axios.get<{ data: TwitchGame[] }>(
    `${BASE_URL}/games?id=${ids.join('&id=')}`,
    {
      headers: {
        'Client-ID': ctx.id,
        Authorization: `Bearer ${ctx.token}`
      }
    }
  )
  return data.data
}

export default {
  getClips,
  getGames
}
