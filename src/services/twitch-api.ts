import axios from "axios";
import config from "@/assets/config";
import { TwitchClip, TwitchGame } from "@/interfaces/twitch";
import { userStore } from "@/stores/user";

const { baseURL, headers } = config.Twitch.API;

const memoizedGames: Record<string, TwitchGame> = {};
const memoizedClips: Record<string, TwitchClip> = {};

export default class TwitchAPI {
  private static axiosClient = axios.create({ baseURL, headers });

  public static async getClip(id: string): Promise<TwitchClip> {
    if (id in memoizedClips) {
      return memoizedClips[id];
    } else {
      const { data } = await this.axiosClient.get<{ data: TwitchClip[] }>(`clips?id=${id}`, {
        headers: {
          Authorization: `Bearer ${userStore.user.accessToken}`,
        },
      });
      const clip = data.data[0];
      memoizedClips[id] = clip;
      return clip;
    }
  }

  public static async getGame(id: string): Promise<TwitchGame> {
    if (id in memoizedGames) {
      return memoizedGames[id];
    } else {
      const { data } = await this.axiosClient.get<{ data: TwitchGame[] }>(`games?id=${id}`, {
        headers: {
          Authorization: `Bearer ${userStore.user.accessToken}`,
        },
      });
      const game = data.data[0];
      memoizedGames[id] = game;
      return game;
    }
  }
}
