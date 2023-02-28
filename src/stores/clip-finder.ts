import { defineStore } from 'pinia'
import { env } from '@/assets/config'
import type { Clip } from '@/interfaces/clips'
import type { TwitchClip, TwitchGame } from '@/services/twitch'
import { useReddit } from '@/stores/reddit'
import reddit from '@/services/reddit'
import twitch from '@/services/twitch'
import { useUser } from '@/stores/user'

const { CLIENT_ID } = env

export const useClipFinder = defineStore('clip-finder', {
  persist: {
    key: 'twitch-cache'
  },
  state: () => ({
    clips: {} as Record<string, TwitchClip>,
    games: {} as Record<string, TwitchGame>
  }),
  getters: {
    cacheEmpty: (state) => {
      return Object.keys(state.clips).length === 0 || Object.keys(state.games).length === 0
    },
    getClips: (state) => {
      return async (ids: string[]): Promise<Clip[]> => {
        const unknownClipIds = [...new Set(ids.filter((id) => !(id in state.clips)))]
        if (unknownClipIds) {
          const user = useUser()
          const clips = await twitch.getClips(unknownClipIds, CLIENT_ID, user?.accessToken ?? '')
          clips.forEach((c) => {
            state.clips[c.id] = c
          })
          const unknownGameIds = [
            ...new Set(clips.map((c) => c.game_id).filter((id) => !(id in state.games)))
          ]
          const games = await twitch.getGames(unknownGameIds, CLIENT_ID, user?.accessToken ?? '')
          games.forEach((g) => {
            state.games[g.id] = g
          })
        }
        return ids
          .filter((id) => id in state.clips)
          .map((id) => {
            const clip = state.clips?.[id]
            const game = state.games?.[clip?.game_id]
            return {
              id: clip.id,
              title: clip?.title,
              channel: clip?.broadcaster_name,
              game: game?.name,
              timestamp: clip?.created_at,
              url: clip?.url,
              embedUrl: clip?.embed_url,
              thumbnailUrl: clip?.thumbnail_url
            }
          })
      }
    }
  },
  actions: {
    async getClipsFromSubreddit(subreddit: string): Promise<Clip[]> {
      const r = useReddit()
      const subredditPosts = await reddit.getSubredditPosts(subreddit, r.postsToCheck)
      const filtedSubredditPosts = subredditPosts.filter((p) => {
        const clipId = twitch.getClipIdFromUrl(p?.data?.url) !== undefined
        return !p.data?.stickied && clipId
      })
      const postInfo = filtedSubredditPosts.map((p) => {
        return {
          id: twitch.getClipIdFromUrl(p?.data.url) as string,
          submitter: p?.data?.author
        }
      })
      const clipIds = postInfo.map((i) => i.id)
      const clips = await this.getClips(clipIds)
      clips.map((c) => {
        const submitter = postInfo.findIndex((v) => v.id === c.id)
        c.submitter = postInfo?.[submitter]?.submitter
      })
      return clips
    },
    async getTwitchClip(url: string): Promise<Clip | undefined> {
      const id = twitch.getClipIdFromUrl(url)
      if (id) {
        const response = await this.getClips([id])
        return response[0]
      }
    }
  }
})
