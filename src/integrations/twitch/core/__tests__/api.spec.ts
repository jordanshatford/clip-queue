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
})
