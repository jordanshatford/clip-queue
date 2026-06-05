import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockTwitchClip, mockTwitchGame, mockTwitchVod } from '~~/test/mocks'

import { getClips, getGames, getVideos, toCommonHeaders } from '~/integrations/twitch/core/api'

const $fetchMock = vi.fn()

describe('integrations/twitch/core/api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('$fetch', $fetchMock)
    $fetchMock.mockResolvedValue({ data: [mockTwitchClip] })
  })

  it('gets a twitch clips from twitch api', async () => {
    $fetchMock.mockResolvedValueOnce({ data: [mockTwitchClip] })
    const clips = await getClips('', '', ['testclip'])
    const clipInfo = clips[0]
    expect(clipInfo).toBeDefined()
    expect(clipInfo?.id).toEqual('testclip')
    expect(clipInfo?.title).toEqual('testtitle')
    expect(clipInfo?.broadcaster_name).toEqual('testbroadcaster')
    expect($fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws if no clip IDs are passed', async () => {
    await expect(getClips('', '', [])).rejects.toThrow('Clip IDs were not provided.')
  })

  it('throws when the clip fetch fails', async () => {
    $fetchMock.mockRejectedValueOnce(new Error('Unknown Error'))
    await expect(getClips('client-id', 'token-123', ['clip-1'])).rejects.toThrow('Unknown Error')
  })

  it('gets a twitch games from twitch api', async () => {
    $fetchMock.mockResolvedValueOnce({ data: [mockTwitchGame] })
    const games = await getGames('', '', ['testgame'])
    const gameInfo = games[0]
    expect(gameInfo).toBeDefined()
    expect(gameInfo?.id).toEqual('testgame')
    expect(gameInfo?.name).toEqual('testgame')
    expect($fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws if no game IDs are passed', async () => {
    await expect(getGames('', '', [])).rejects.toThrow('Game IDs were not provided.')
  })

  it('throws when the game fetch fails', async () => {
    $fetchMock.mockRejectedValueOnce(new Error('Unknown Error'))
    await expect(getGames('client-id', 'token-123', ['game-1'])).rejects.toThrow('Unknown Error')
  })

  it('gets a twitch videos from twitch api', async () => {
    $fetchMock.mockResolvedValueOnce({ data: [mockTwitchVod] })
    const videos = await getVideos('', '', ['testvod'])
    const clipInfo = videos[0]
    expect(clipInfo).toBeDefined()
    expect(clipInfo?.id).toEqual('testvod')
    expect(clipInfo?.title).toEqual('testvod')
    expect($fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws if no video IDs are passed', async () => {
    await expect(getVideos('', '', [])).rejects.toThrow('Video IDs were not provided.')
  })

  it('throws when the video fetch fails', async () => {
    $fetchMock.mockRejectedValueOnce(new Error('Unknown Error'))
    await expect(getVideos('client-id', 'token-123', ['video-1'])).rejects.toThrow('Unknown Error')
  })

  it('gets authorization headers based on a twitch users context', () => {
    const headers = toCommonHeaders('', 'testToken')
    expect(headers['Authorization']).toEqual('Bearer testToken')
  })
})
