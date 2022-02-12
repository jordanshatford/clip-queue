import config, { env } from "@/assets/config"
import type { Clip } from "@/interfaces/clips"
import reddit from "@/services/reddit"
import twitch from "@/services/twitch"
import type { TwitchClip, TwitchGame } from "@/services/twitch"
import { cache } from "@/utils/cache"
import { useUser } from "@/stores/user"

const { maxPostsToCheck } = config.Reddit
const { CLIENT_ID } = env

export default class ClipFinder {
  public static async getClipsFromSubreddit(
    subreddit: string,
    callback?: (clip: Clip, done: boolean) => void
  ): Promise<Clip[] | undefined> {
    const subredditPosts = await reddit.getSubredditPosts(subreddit, maxPostsToCheck)
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
    if (!twitch.isClipUrl(url)) {
      return
    }

    const id = twitch.getClipIdFromUrl(url)

    let clipInfo: TwitchClip
    const clip = cache.getClip(id)
    if (clip) {
      clipInfo = clip
    } else {
      const user = useUser()
      clipInfo = await twitch.getClip(id, CLIENT_ID, user?.accessToken ?? "")
      cache.addClip(clipInfo)
    }

    if (clipInfo) {
      let game: TwitchGame
      const cacheGame = cache.getGame(clipInfo.game_id)

      if (cacheGame) {
        game = cacheGame
      } else {
        const user = useUser()
        game = await twitch.getGame(clipInfo.game_id, CLIENT_ID, user?.accessToken ?? "")
        cache.addGame(game)
      }
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
}
