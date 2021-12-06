import config from "@/config";
import { Clip } from "@/interfaces/clips";
import TwitchAPI from "@/services/twitch-api";

const { hostnames } = config.Twitch.Clips;

export default class ClipFinder {
  public static async getTwitchClip(url: string): Promise<Clip | undefined> {
    if (!this.isTwitchClip(url)) {
      return
    }

    const uri = new URL(url);
    const idStart = uri.pathname.lastIndexOf('/');
    const id = uri.pathname.slice(idStart).split('?')[0].slice(1);

    const clipInfo = await TwitchAPI.getClip(id);

    if (clipInfo) {
      const game = await TwitchAPI.getGame(clipInfo.game_id)

      return {
        id,
        title: clipInfo.title,
        channel: clipInfo.broadcaster_name,
        game: game.name,
        timestamp: clipInfo.created_at,
        url: clipInfo.url,
        thumbnailUrl: clipInfo.thumbnail_url,
      };
    }
  }

  private static isTwitchClip(url: string): boolean {
    const uri = new URL(url);
    return hostnames.includes(uri.hostname);
  }
}
