import type { $Fetch } from 'ofetch'

import { ofetch } from 'ofetch'

import type {
  TwitchClip,
  TwitchGame,
  TwitchPagedResponse,
  TwitchResponse,
  TwitchVideo,
  TwitchUser,
} from './types'

import { CacheMap } from '../utils/cache'

/**
 * Class used for interacting with Twitch API.
 *
 * It internally handles caching results in memory.
 */
export class TwitchAPI {
  private readonly helix: $Fetch

  private readonly clips: CacheMap<TwitchClip> = new CacheMap()
  private readonly games: CacheMap<TwitchGame> = new CacheMap()
  private readonly videos: CacheMap<TwitchVideo> = new CacheMap()
  private readonly users: CacheMap<TwitchUser> = new CacheMap()

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
   *
   * @see https://dev.twitch.tv/docs/api/reference#get-clips
   */
  public async getClip(id: string): Promise<TwitchClip> {
    if (!id) {
      throw new Error('Clip ID was not provided.')
    }
    return this.clips.cached(id, async (): Promise<TwitchClip> => {
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
   *
   * @see https://dev.twitch.tv/docs/api/reference#get-games
   */
  public async getGame(id: string): Promise<TwitchGame> {
    if (!id) {
      throw new Error('Game ID was not provided.')
    }
    return this.games.cached(id, async (): Promise<TwitchGame> => {
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
   * Get a video from Twitch.
   * @param id - The ID of the video.
   * @returns The video.
   * @throws Will throw an error if no video ID is provided, the fetch fails, or the video does not exist.
   *
   * @see https://dev.twitch.tv/docs/api/reference#get-videos
   */
  public async getVideo(id: string): Promise<TwitchVideo> {
    if (!id) {
      throw new Error('Video ID was not provided.')
    }
    return this.videos.cached(id, async (): Promise<TwitchVideo> => {
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

  /**
   * Get a user from Twitch.
   * @param id - The ID of the user. When not defined it is the user based on the current access token.
   * @returns The user.
   * @throws Will throw an error if the fetch fails, or the user does not exist.
   *
   * @see https://dev.twitch.tv/docs/api/reference#get-users
   */
  public async getUser(id?: string): Promise<TwitchUser> {
    const key = id ?? this.authentication().accessToken
    return this.users.cached(key, async (): Promise<TwitchUser> => {
      const response = await this.helix<TwitchResponse<TwitchUser[]>>('/users', {
        query: { id },
      })
      const user = response.data[0]
      if (!user) {
        throw new Error(`User with ID ${id} does not exist.`)
      }
      return user
    })
  }
}
