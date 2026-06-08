import type { $Fetch } from 'ofetch'

import { ofetch } from 'ofetch'

import type {
  TwitchClip,
  TwitchGame,
  TwitchPagedResponse,
  TwitchResponse,
  TwitchVideo,
} from './types'

type Cache<T> = Record<string, T>

/**
 * Class used for interacting with Twitch API. It internally handles caching results
 * in memory.
 */
export class TwitchAPI {
  private readonly helix: $Fetch

  private readonly clips: Cache<TwitchClip> = {}
  private readonly games: Cache<TwitchGame> = {}
  private readonly videos: Cache<TwitchVideo> = {}

  private async cached<T>(cache: Cache<T>, key: string, factory: () => Promise<T>): Promise<T> {
    const existing = cache[key]
    if (existing) {
      return existing
    }
    const value = await factory()
    cache[key] = value
    return value
  }

  public constructor(
    private readonly authentication: () => { clientId: string; accessToken: string },
  ) {
    this.helix = ofetch.create({
      baseURL: 'https://api.twitch.tv/helix',
      onRequest: async ({ options }) => {
        const headers = options.headers
        // Ensure client ID and access token are added to headers based on the currently
        // logged in user.
        const auth = authentication()
        headers.set('Client-ID', auth.clientId)
        headers.set('Authorization', `Bearer ${auth.accessToken}`)
      },
    })
  }

  /**
   * Determine if the API is misconfigured and may not work as intended. For Twitch it is
   * required that the client ID and access token are present.
   */
  public get isMisconfigued(): boolean {
    const auth = this.authentication()
    return !auth.clientId || !auth.accessToken
  }

  /**
   * Get a clip from Twitch.
   * @param id - The ID of the clip.
   * @returns The clip.
   * @throws Will throw an error if no clip ID is provided, the fetch fails, or the clip does not exist.
   */
  public async getClip(id: string): Promise<TwitchClip> {
    if (!id) {
      throw new Error('Clip ID was not provided.')
    }
    return this.cached<TwitchClip>(this.clips, id, async (): Promise<TwitchClip> => {
      const response = await this.helix<TwitchPagedResponse<TwitchClip[]>>('/clips', {
        query: { id },
      })
      const clip = response.data[0]
      if (!clip) {
        throw new Error(`Clip with ID ${id} does not exist.`)
      }
      return clip
    })
  }

  /**
   * Get a game from Twitch.
   * @param id - The ID of the game.
   * @returns The game.
   * @throws Will throw an error if no game ID is provided, the fetch fails, or the game does not exist.
   */
  public async getGame(id: string): Promise<TwitchGame> {
    if (!id) {
      throw new Error('Game ID was not provided.')
    }
    return this.cached(this.games, id, async (): Promise<TwitchGame> => {
      const response = await this.helix<TwitchResponse<TwitchGame[]>>('/games', {
        query: { id },
      })
      const game = response.data[0]
      if (!game) {
        throw new Error(`Game with ID ${id} does not exist.`)
      }
      return game
    })
  }

  /**
   * Get a video (VOD) from Twitch.
   * @param id - The ID of the video.
   * @returns The video.
   * @throws Will throw an error if no video ID is provided, the fetch fails, or the video does not exist.
   */
  public async getVideo(id: string): Promise<TwitchVideo> {
    if (!id) {
      throw new Error('Video ID was not provided.')
    }
    return this.cached(this.videos, id, async (): Promise<TwitchVideo> => {
      const response = await this.helix<TwitchPagedResponse<TwitchVideo[]>>('/videos', {
        query: { id },
      })
      const video = response.data[0]
      if (!video) {
        throw new Error(`Video with ID ${id} does not exist.`)
      }
      return video
    })
  }
}
