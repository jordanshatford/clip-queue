import { env } from "@/assets/config"
import type { Clip } from "@/interfaces/clips"
import type { TwitchClip, TwitchGame } from "@/services/twitch"
import { defineStore } from "pinia"
import { useReddit } from "@/stores/reddit"
import reddit from "@/services/reddit"
import twitch from "@/services/twitch"
import { useUser } from "./user"

const { CLIENT_ID } = env

export const LOCAL_STORAGE_KEY = "twitch-cache"

export const useClipFinder = defineStore("clip-finder", {
  state: () => ({
    clips: {} as Record<string, TwitchClip>,
    games: {} as Record<string, TwitchGame>,
  }),
  getters: {
    getClip: (state) => {
      return async (id: string): Promise<TwitchClip> => {
        const cachedClip = state.clips?.[id]
        if (cachedClip) {
          return cachedClip
        }
        const user = useUser()
        const clip = await twitch.getClip(id, CLIENT_ID, user?.accessToken ?? "")
        state.clips[id] = clip
        return clip
      }
    },
    getGame: (state) => {
      return async (id: string): Promise<TwitchGame> => {
        const cachedGame = state.games?.[id]
        if (cachedGame) {
          return cachedGame
        }
        const user = useUser()
        const game = await twitch.getGame(id, CLIENT_ID, user?.accessToken ?? "")
        state.games[id] = game
        return game
      }
    },
  },
  actions: {
    init() {
      const localStorageState = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (localStorageState) {
        const savedState = JSON.parse(localStorageState)
        this.$patch(savedState)
      }
    },
    async getClipsFromSubreddit(
      subreddit: string,
      callback?: (clip: Clip, done: boolean) => void
    ): Promise<Clip[] | undefined> {
      const r = useReddit()
      const subredditPosts = await reddit.getSubredditPosts(subreddit, r.postsToCheck)
      let clips: Clip[] = []
      for (const post of subredditPosts) {
        if (post.data?.stickied) {
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
    },
    async getTwitchClip(url: string): Promise<Clip | undefined> {
      if (!twitch.isClipUrl(url)) {
        return
      }
      const id = twitch.getClipIdFromUrl(url)
      const clip = await this.getClip(id)
      if (clip) {
        const game = await this.getGame(clip.game_id)
        return {
          id,
          title: clip?.title,
          channel: clip?.broadcaster_name,
          game: game?.name,
          timestamp: clip?.created_at,
          url: clip?.url,
          embedUrl: clip?.embed_url,
          thumbnailUrl: clip?.thumbnail_url,
        }
      }
    },
  },
})
