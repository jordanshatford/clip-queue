import type { $Fetch } from 'ofetch'

import { ofetch } from 'ofetch'

import type { OAuthAuthentication } from '../utils'
import type {
  GenericKickResponse,
  KickChannelPartial,
  KickClip,
  KickUser,
  KickVideo,
} from './types'

import { CacheMap } from '../utils/cache'

/**
 * Class used for interacting with Twitch API.
 *
 * It internally handles caching results in memory.
 */
export class KickAPI {
  private readonly privateApi: $Fetch
  private readonly publicApi: $Fetch

  private readonly clips: CacheMap<KickClip> = new CacheMap()
  private readonly videos: CacheMap<KickVideo> = new CacheMap()
  private readonly channels: CacheMap<KickChannelPartial> = new CacheMap()
  private readonly users: CacheMap<KickUser> = new CacheMap()

  public constructor(private readonly authentication?: () => OAuthAuthentication) {
    this.privateApi = ofetch.create({ baseURL: 'https://kick.com/api' })
    this.publicApi = ofetch.create({
      baseURL: 'https://api.kick.com/public',
      onRequest: async ({ options }) => {
        const headers = options.headers
        // Ensure access token are added to headers based on the currently logged in user.
        const bearer = authentication?.().accessToken
        if (bearer) {
          headers.set('Authorization', `Bearer ${bearer}`)
        }
      },
    })
  }

  /**
   * Get a Kick clip by ID.
   * @param id - The Kick clip ID.
   * @returns The Kick clip.
   * @throws Will throw an error if no clip ID is provided or the fetch fails.
   */
  public async getClip(id: string): Promise<KickClip> {
    if (!id) {
      throw new Error('Clip ID was not provided.')
    }
    return this.clips.cached(id, async (): Promise<KickClip> => {
      const { clip } = await this.privateApi<{ clip: KickClip }>(`/v2/clips/${id}`)
      return clip
    })
  }

  /**
   * Get a Kick video by ID.
   * @param id - The Kick video ID.
   * @returns The Kick video.
   * @throws Will throw an error if no video ID is provided or the fetch fails.
   */
  public async getVideo(id: string): Promise<KickVideo> {
    if (!id) {
      throw new Error('Video ID was not provided.')
    }
    return this.videos.cached(id, async (): Promise<KickVideo> => {
      return this.privateApi<KickVideo>(`/v1/video/${id}`)
    })
  }

  /**
   * Get a Kick channel by name.
   * @param channel - The Kick channel name.
   * @returns The Kick channel.
   * @throws Will throw an error if no channel name is provided or the fetch fails.
   *
   * @note This currently only returns partial channel details required by
   *       our application.
   */
  public async getChannel(channel: string): Promise<KickChannelPartial> {
    if (!channel) {
      throw new Error('Channel name was not provided.')
    }
    return this.channels.cached(channel, async (): Promise<KickChannelPartial> => {
      return this.privateApi<KickChannelPartial>(`/v2/channels/${channel}`)
    })
  }

  /**
   * Get a user from Kick.
   * @param id - The ID of the user. When not defined it is the user based on the current access token.
   * @returns The user.
   * @throws Will throw an error if the fetch fails, or the user does not exist.
   *
   * @see https://docs.kick.com/apis/users
   */
  public async getUser(id?: string): Promise<KickUser> {
    const key = id ?? this.authentication?.().accessToken
    if (!key) {
      throw new Error('User ID or access token was not provided.')
    }
    return this.users.cached(key, async (): Promise<KickUser> => {
      const response = await this.publicApi<GenericKickResponse<KickUser[]>>('/v1/users', {
        query: { id },
      })
      const user = response.data?.[0]
      if (!user) {
        throw new Error(`User with ID ${id} does not exist.`)
      }
      return user
    })
  }
}
