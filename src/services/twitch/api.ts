import axios from 'axios'
import type { TwitchGame, TwitchClip } from './types'

const BASE_URL = 'https://api.twitch.tv/helix'

export async function getClips(
  ids: string[],
  clientId: string,
  accessToken: string
): Promise<TwitchClip[]> {
  if (ids.length <= 0) {
    return []
  }
  const { data } = await axios.get<{ data: TwitchClip[] }>(
    `${BASE_URL}/clips?id=${ids.join('&id=')}`,
    {
      headers: {
        'Client-ID': clientId,
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
  return data.data
}

export async function getGames(
  ids: string[],
  clientId: string,
  accessToken: string
): Promise<TwitchGame[]> {
  if (ids.length <= 0) {
    return []
  }
  const { data } = await axios.get<{ data: TwitchGame[] }>(
    `${BASE_URL}/games?id=${ids.join('&id=')}`,
    {
      headers: {
        'Client-ID': clientId,
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
  return data.data
}

export default {
  getClips,
  getGames
}
