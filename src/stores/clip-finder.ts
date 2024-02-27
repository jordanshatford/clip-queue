import { defineStore } from 'pinia'
import { ClipProvider, type Clip } from '@/interfaces/clips'
import type { TwitchClip, TwitchGame } from '@/services/twitch'
import twitch from '@/services/twitch'
import kick from '@/services/kick'
import { useUser } from '@/stores/user'

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
          const clips = await twitch.getClips(user.ctx, unknownClipIds)
          clips.forEach((c) => {
            state.clips[c.id] = c
          })
          const unknownGameIds = [
            ...new Set(clips.map((c) => c.game_id).filter((id) => !(id in state.games)))
          ]
          const games = await twitch.getGames(user.ctx, unknownGameIds)
          games.forEach((g) => {
            state.games[g.id] = g
          })
        }
        return ids
          .filter((id) => id in state.clips)
          .map<Clip>((id) => {
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
              thumbnailUrl: clip?.thumbnail_url,
              provider: ClipProvider.TWITCH
            }
          })
      }
    }
  },
  actions: {
    async getTwitchClip(url: string): Promise<Clip | undefined> {
      const id = twitch.getClipIdFromUrl(url)
      if (id) {
        const response = await this.getClips([id])
        return response[0]
      }
    },
    async getKickClip(url: string): Promise<Clip | undefined> {
      const id = kick.getClipIdFromUrl(url)
      if (id) {
        const clip = await kick.getClip(id)
        if (clip) {
          const response: Clip = {
            id: clip.id,
            title: clip.title,
            channel: clip.channel.username,
            game: clip.category.name,
            timestamp: clip.created_at,
            url: url,
            embedUrl: clip.clip_url,
            thumbnailUrl: clip.thumbnail_url,
            provider: ClipProvider.KICK
          }
          return response
        }
      }
    }
  }
})
