import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { TwitchUserCtx } from '..'
import { mockTwitchClip, mockTwitchGame } from '../../__tests__/mocks'
import TwitchAPI, { toCommonHeaders } from '../api'

describe('twitch-api.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn().mockImplementation((url: string) =>
      Promise.resolve({
        ok: true,
        json: () => {
          let data = {}
          if (url.includes('clips')) {
            data = [mockTwitchClip]
          } else if (url.includes('games')) {
            data = [mockTwitchGame]
          }
          return Promise.resolve({ data })
        }
      })
    )
  })

  it('gets a twitch clips from twitch api', async () => {
    const clips = await TwitchAPI.getClips({ id: '', token: '', username: '' }, ['testclip'])
    const clipInfo = clips[0]
    expect(clipInfo).toBeDefined()
    expect(clipInfo?.id).toEqual('testclip')
    expect(clipInfo?.title).toEqual('testtitle')
    expect(clipInfo?.broadcaster_name).toEqual('testbroadcaster')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('gets a twitch games from twitch api', async () => {
    const games = await TwitchAPI.getGames({ id: '', token: '', username: '' }, ['testgame'])
    const gameInfo = games[0]
    expect(gameInfo).toBeDefined()
    expect(gameInfo?.id).toEqual('testgame')
    expect(gameInfo?.name).toEqual('testgame')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('gets the common headers based on come ctx', () => {
    const ctx: TwitchUserCtx = { id: 'test', token: 'testToken' }
    expect(toCommonHeaders(ctx)).toEqual({
      'Client-ID': 'test',
      Authorization: `Bearer testToken`
    })
  })
})
