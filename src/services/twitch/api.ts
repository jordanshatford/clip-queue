import axios from "axios"
import type { TwitchGame, TwitchClip } from "./types"

const BASE_URL = "https://api.twitch.tv/helix"

export async function getClip(id: string, clientId: string, accessToken: string): Promise<TwitchClip> {
  const { data } = await axios.get<{ data: TwitchClip[] }>(`${BASE_URL}/clips?id=${id}`, {
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return data.data[0]
}

export async function getGame(id: string, clientId: string, accessToken: string): Promise<TwitchGame> {
  const { data } = await axios.get<{ data: TwitchGame[] }>(`${BASE_URL}/games?id=${id}`, {
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return data.data[0]
}

export default {
  getClip,
  getGame,
}
