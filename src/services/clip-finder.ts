import config from "@/assets/config"
import type { Clip } from "@/interfaces/clips"
import TwitchAPI from "@/services/twitch-api"
import Reddit from "@/services/reddit"
import { getIdFromUrl } from "@/utils/url"

const { hostnames } = config.Twitch.Clips

export default class ClipFinder {
  public static async getClipsFromSubreddit(
    subreddit: string,
    callback?: (clip: Clip, done: boolean) => void
  ): Promise<Clip[] | undefined> {
    const subredditPosts = await Reddit.getSubredditPosts(subreddit)
    let clips: Clip[] = []
    for (const post of subredditPosts) {
      if (post?.data?.stickied) {
        continue
      }
      const clip = await this.getTwitchClip(post?.data?.url)
      if (clip) {
        callback?.({ ...clip, submitter: post.data.author }, false)
        clips = [...clips, { ...clip, submitter: post.data.author }]
      }
    }
    callback?.({}, true)
    return clips
  }

  public static async getTwitchClip(url: string): Promise<Clip | undefined> {
    if (!this.isTwitchClip(url)) {
      return
    }

    const id = getIdFromUrl(url)
    const clipInfo = await TwitchAPI.getClip(id)

    if (clipInfo) {
      const game = await TwitchAPI.getGame(clipInfo.game_id)
      return {
        id,
        title: clipInfo?.title,
        channel: clipInfo?.broadcaster_name,
        game: game?.name,
        timestamp: clipInfo?.created_at,
        url: clipInfo?.url,
        embedUrl: clipInfo?.embed_url,
        thumbnailUrl: clipInfo?.thumbnail_url,
      }
    }
  }

  private static isTwitchClip(url: string): boolean {
    try {
      const uri = new URL(url)
      return hostnames.includes(uri.hostname)
    } catch {
      return false
    }
  }
}
