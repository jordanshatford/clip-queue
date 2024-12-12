import axios from 'axios'

import type {
  TwitchClip,
  TwitchGame,
  TwitchPagedResponse,
  TwitchResponse,
  TwitchUserCtx
} from './types'
import { toURLParams } from './utils'

const api = axios.create({
  baseURL: 'https://api.twitch.tv/helix'
})

export function toCommonHeaders(ctx: TwitchUserCtx) {
  return {
    'Client-ID': ctx.id,
    Authorization: `Bearer ${ctx.token}`
  }
}

export async function getClips(ctx: TwitchUserCtx, ids: string[]): Promise<TwitchClip[]> {
  if (ids.length <= 0) {
    return []
  }
  try {
    const { data } = await api.get<TwitchPagedResponse<TwitchClip[]>>('clips', {
      headers: toCommonHeaders(ctx),
      params: toURLParams('id', ids)
    })
    return data.data
  } catch (e) {
    console.error('Failed to fetch Twitch clips: ', ids, e)
  }
  return []
}

export async function getGames(ctx: TwitchUserCtx, ids: string[]): Promise<TwitchGame[]> {
  if (ids.length <= 0) {
    return []
  }
  try {
    const { data } = await api.get<TwitchResponse<TwitchGame[]>>('games', {
      headers: toCommonHeaders(ctx),
      params: toURLParams('id', ids)
    })
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
