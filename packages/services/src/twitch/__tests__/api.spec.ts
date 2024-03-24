import { beforeEach, describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import TwitchAPI from '../api'
import { toCommonHeaders } from '../api'
import type { TwitchUserCtx } from '..'
import { mockTwitchClip, mockTwitchGame } from '../../__tests__/mocks'

vi.mock('axios', async () => {
  const mockGet = vi.fn().mockImplementation((url: string) => {
    let data = {}
    if (url.includes('clips')) {
      data = [mockTwitchClip]
    } else if (url.includes('games')) {
      data = [mockTwitchGame]
    }
    return {
      data: {
        data: data
      }
    }
  })
  return {
    default: {
      create: vi.fn(() => {
        return {
          get: mockGet
        }
      })
    }
  }
})

describe('twitch-api.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gets a twitch clips from twitch api', async () => {
    const clips = await TwitchAPI.getClips({ id: '', token: '', username: '' }, ['testclip'])
    const clipInfo = clips[0]
    expect(clipInfo.id).toEqual('testclip')
    expect(clipInfo.title).toEqual('testtitle')
    expect(clipInfo.broadcaster_name).toEqual('testbroadcaster')
    expect(axios.create().get).toHaveBeenCalledTimes(1)
  })

  it('gets a twitch games from twitch api', async () => {
    const games = await TwitchAPI.getGames({ id: '', token: '', username: '' }, ['testgame'])
    const gameInfo = games[0]
    expect(gameInfo.id).toEqual('testgame')
    expect(gameInfo.name).toEqual('testgame')
    expect(axios.create().get).toHaveBeenCalledTimes(1)
  })

  it('gets the common headers based on come ctx', () => {
    const ctx: TwitchUserCtx = { id: 'test', token: 'testToken' }
    expect(toCommonHeaders(ctx)).toEqual({
      'Client-ID': 'test',
      Authorization: `Bearer testToken`
    })
  })
})
