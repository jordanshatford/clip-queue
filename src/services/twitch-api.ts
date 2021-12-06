import axios from "axios";
import config from "@/config";
import { TwitchClip, TwitchGame } from "@/interfaces/twitch";
import { userStore } from "@/stores/user";

const { baseURL, headers } = config.Twitch.API;

export default class TwitchAPI {
  private static axiosClient = axios.create({ baseURL, headers });

  public static async getClip(id: string): Promise<TwitchClip> {
    const { data } = await this.axiosClient.get<{ data: TwitchClip[] }>(`clips?id=${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.user.accessToken}`,
      },
    });
    return data.data[0];
  }

  public static async getGame(id: string): Promise<TwitchGame> {
    const { data } = await this.axiosClient.get<{ data: TwitchGame[] }>(`games?id=${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.user.accessToken}`,
      },
    });
    return data.data[0];
  }
}
