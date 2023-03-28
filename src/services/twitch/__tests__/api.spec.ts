import { beforeEach, describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import TwitchAPI from '../api'
import { toCommonHeaders, toURLParams } from '../api'
import type { TwitchClip, TwitchGame, TwitchUserCtx } from '..'

function mockTwitchResponse(url: string) {
  let data = {}
  if (url.includes('clips')) {
    data = [
      {
        id: 'testid',
        game_id: 'testgame',
        title: 'Test title',
        broadcaster_name: 'testbroadcast',
        created_at: '',
        thumbnail_url: '',
        url: 'https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j',
        embed_url: 'https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j'
      } as TwitchClip
    ]
  } else if (url.includes('games')) {
    data = [{ id: 'gameid', name: 'Test Game' } as TwitchGame]
  }
  return {
    data: data
  }
}

vi.mock('axios', async () => {
  const mockGet = vi.fn().mockImplementation((url: string) => {
    return {
      data: mockTwitchResponse(url)
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
    const clips = await TwitchAPI.getClips({ id: '', token: '', username: '' }, ['testid'])
    const clipInfo = clips[0]
    expect(clipInfo.id).toEqual('testid')
    expect(clipInfo.title).toEqual('Test title')
    expect(clipInfo.broadcaster_name).toEqual('testbroadcast')
    expect(axios.create().get).toHaveBeenCalledTimes(1)
  })

  it('gets a twitch games from twitch api', async () => {
    const games = await TwitchAPI.getGames({ id: '', token: '', username: '' }, ['gameid'])
    const gameInfo = games[0]
    expect(gameInfo.id).toEqual('gameid')
    expect(gameInfo.name).toEqual('Test Game')
    expect(axios.create().get).toHaveBeenCalledTimes(1)
  })

  it('gets the common headers based on come ctx', () => {
    const ctx: TwitchUserCtx = { id: 'test', token: 'testToken' }
    expect(toCommonHeaders(ctx)).toEqual({
      'Client-ID': 'test',
      Authorization: `Bearer testToken`
    })
  })

  it.each([
    ['id', ['test1', 'test2', 'test3']],
    ['game_id', ['duplicate', 'duplicate', 'duplicate', 'new']],
    ['broadcaster_id', ['user', 'user1', 'user2']]
  ])('gets url search params for values passed (%s, %s)', (key: string, values: string[]) => {
    const p = toURLParams(key, values)
    expect(p.has(key)).toEqual(true)
    expect(p.getAll(key).length).toEqual(values.length)
    expect(p.toString()).toEqual(`${key}=${values.join(`&${key}=`)}`)
  })
})
