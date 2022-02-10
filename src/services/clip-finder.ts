import config from "@/assets/config"
import type { Clip } from "@/interfaces/clips"
import reddit from "@/services/reddit"
import twitch from "@/services/twitch"
import type { TwitchClip, TwitchGame } from "@/services/twitch"
import { getIdFromUrl } from "@/utils/url"
import { cache } from "@/utils/cache"
import { userStore } from "@/stores/user"

const { hostnames } = config.Twitch.Clips
const { maxPostsToCheck } = config.Reddit
const { clientId } = config.Twitch.Auth

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
    if (!this.isTwitchClip(url)) {
      return
    }

    const id = getIdFromUrl(url)

    let clipInfo: TwitchClip
    const clip = cache.getClip(id)
    if (clip) {
      clipInfo = clip
    } else {
      clipInfo = await twitch.getClip(id, clientId, userStore.user.accessToken)
      cache.addClip(clipInfo)
    }

    if (clipInfo) {
      let game: TwitchGame
      const cacheGame = cache.getGame(clipInfo.game_id)

      if (cacheGame) {
        game = cacheGame
      } else {
        game = await twitch.getGame(clipInfo.game_id, clientId, userStore.user.accessToken)
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

  private static isTwitchClip(url: string): boolean {
    try {
      const uri = new URL(url)
      return hostnames.includes(uri.hostname)
    } catch {
      return false
    }
  }
}
