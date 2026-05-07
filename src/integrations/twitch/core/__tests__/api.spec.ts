import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  mockTwitchClip,
  mockTwitchGame,
  mockTwitchUser,
  mockTwitchVod,
} from '../../../core/__tests__/mocks'
import { getClips, getGames, getUsers, getVideos, toCommonHeaders } from '../api'

describe('integrations/twitch/core/api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn<typeof fetch>().mockImplementation((url) =>
      Promise.resolve({
        ok: true,
        json: () => {
          let data = {}
          if (url.toString().includes('clips')) {
            data = [mockTwitchClip]
          } else if (url.toString().includes('games')) {
            data = [mockTwitchGame]
          } else if (url.toString().includes('users')) {
            data = [mockTwitchUser]
          } else if (url.toString().includes('videos')) {
            data = [mockTwitchVod]
          }
          return Promise.resolve({ data })
        },
      } as Response),
    )
  })

  it('gets a twitch clips from twitch api', async () => {
    const clips = await getClips('', '', ['testclip'])
    const clipInfo = clips[0]
    expect(clipInfo).toBeDefined()
    expect(clipInfo?.id).toEqual('testclip')
    expect(clipInfo?.title).toEqual('testtitle')
    expect(clipInfo?.broadcaster_name).toEqual('testbroadcaster')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('throws if no clip IDs are passed', async () => {
    await expect(getClips('', '', [])).rejects.toThrow('Clip IDs were not provided.')
  })

  it('throws when the clip fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'Forbidden',
    } as Response)

    await expect(getClips('client-id', 'token-123', ['clip-1'])).rejects.toThrow(
      'Failed to fetch clips with IDs clip-1: Forbidden',
    )
  })

  it('gets a twitch games from twitch api', async () => {
    const games = await getGames('', '', ['testgame'])
    const gameInfo = games[0]
    expect(gameInfo).toBeDefined()
    expect(gameInfo?.id).toEqual('testgame')
    expect(gameInfo?.name).toEqual('testgame')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('throws if no game IDs are passed', async () => {
    await expect(getGames('', '', [])).rejects.toThrow('Game IDs were not provided.')
  })

  it('throws when the game fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
    } as Response)

    await expect(getGames('client-id', 'token-123', ['game-1'])).rejects.toThrow(
      'Failed to fetch games with IDs game-1: Internal Server Error',
    )
  })

  it('gets a twitch videos from twitch api', async () => {
    const videos = await getVideos('', '', ['testvod'])
    const clipInfo = videos[0]
    expect(clipInfo).toBeDefined()
    expect(clipInfo?.id).toEqual('testvod')
    expect(clipInfo?.title).toEqual('testvod')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('throws if no video IDs are passed', async () => {
    await expect(getVideos('', '', [])).rejects.toThrow('Video IDs were not provided.')
  })

  it('throws when the video fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'Unauthorized',
    } as Response)

    await expect(getVideos('client-id', 'token-123', ['video-1'])).rejects.toThrow(
      'Failed to fetch videos with IDs video-1: Unauthorized',
    )
  })

  it('gets a twitch user from twitch api', async () => {
    const users = await getUsers('', '', ['testuser'])
    const userInfo = users[0]
    expect(userInfo).toBeDefined()
    expect(userInfo?.id).toEqual('testuser')
    expect(userInfo?.login).toEqual('testuser')
    expect(userInfo?.display_name).toEqual('Test User')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('gets authorization headers based on a twitch users context', () => {
    const headers = toCommonHeaders('', 'testToken')
    expect(headers['Authorization']).toEqual('Bearer testToken')
  })

  it('throws when the user fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'Bad Request',
    } as Response)

    await expect(getUsers('client-id', 'token-123', ['user-1'])).rejects.toThrow(
      'Failed to users with IDs user-1: Bad Request',
    )
  })
})
