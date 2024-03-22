import { beforeEach, describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import TwitchAPI from '../api'
import { toCommonHeaders } from '../api'
import type { TwitchUserCtx, TwitchGame, TwitchClip } from '..'

export const mockTwitchGame: TwitchGame = {
  id: 'testgame',
  name: 'testgame',
  box_art_url: 'https://twitch.tv/testgame/boxart'
}

export const mockTwitchClip: TwitchClip = {
  id: 'testclip',
  url: 'https://clips.twitch.tv/testclip',
  embed_url: 'https://clips.twitch.tv/testclip',
  broadcaster_id: '123',
  broadcaster_name: 'testbroadcaster',
  creator_id: '456',
  creator_name: 'testcreator',
  video_id: '789',
  game_id: 'testgame',
  language: 'english',
  title: 'testtitle',
  view_count: 777,
  created_at: '2024-02-22T08:47:27.000Z',
  thumbnail_url: 'https://twitch.tv/testclip/thumbnail',
  duration: 50
}

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
