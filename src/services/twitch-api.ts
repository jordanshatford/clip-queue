import axios from "axios"
import config from "@/assets/config"
import type { TwitchClip, TwitchGame } from "@/interfaces/twitch"
import { userStore } from "@/stores/user"
import { cache } from "@/utils/cache"

const { baseURL, headers } = config.Twitch.API

export default class TwitchAPI {
  public static async getClip(id: string): Promise<TwitchClip> {
    const clip = cache.getClip(id)
    if (clip) {
      return clip
    } else {
      const { data } = await axios.get<{ data: TwitchClip[] }>(`${baseURL}/clips?id=${id}`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${userStore.user.accessToken}`,
        },
      })
      const clip = data.data[0]
      cache.addClip(clip)
      return clip
    }
  }

  public static async getGame(id: string): Promise<TwitchGame> {
    const game = cache.getGame(id)
    if (game) {
      return game
    } else {
      const { data } = await axios.get<{ data: TwitchGame[] }>(`${baseURL}/games?id=${id}`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${userStore.user.accessToken}`,
        },
      })
      const game = data.data[0]
      cache.addGame(game)
      return game
    }
  }
}
