import axios from 'axios'
import type {
  TwitchGame,
  TwitchClip,
  TwitchResponse,
  TwitchPagedResponse,
  TwitchUserCtx
} from './types'

const api = axios.create({
  baseURL: 'https://api.twitch.tv/helix'
})

export function toCommonHeaders(ctx: TwitchUserCtx) {
  return {
    'Client-ID': ctx.id,
    Authorization: `Bearer ${ctx.token}`
  }
}

export function toURLParams(key: string, values: string[]): URLSearchParams {
  const params = new URLSearchParams()
  values.forEach((v) => params.append(key, v))
  return params
}

export async function getClips(ctx: TwitchUserCtx, ids: string[]): Promise<TwitchClip[]> {
  if (ids.length <= 0) {
    return []
  }
  const { data } = await api.get<TwitchPagedResponse<TwitchClip[]>>('clips', {
    headers: toCommonHeaders(ctx),
    params: toURLParams('id', ids)
  })
  return data.data
}

export async function getGames(ctx: TwitchUserCtx, ids: string[]): Promise<TwitchGame[]> {
  if (ids.length <= 0) {
    return []
  }
  const { data } = await api.get<TwitchResponse<TwitchGame[]>>('games', {
    headers: toCommonHeaders(ctx),
    params: toURLParams('id', ids)
  })
  return data.data
}

export default {
  getClips,
  getGames
}
