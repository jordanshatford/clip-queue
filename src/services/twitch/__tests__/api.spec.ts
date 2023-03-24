import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import TwitchAPI from '../api'
import { commonHeaders } from '../api'
import type { TwitchClip, TwitchGame, TwitchUserCtx } from '..'

vi.mock('axios', () => {
  return {
    default: {
      get: vi
        .fn()
        .mockResolvedValueOnce({
          data: {
            data: [
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
          }
        })
        .mockResolvedValueOnce({
          data: { data: [{ id: 'gameid', name: 'Test Game' } as TwitchGame] }
        })
    }
  }
})

describe('twitch-api.ts', () => {
  it('gets a twitch clips from twitch api', async () => {
    const clips = await TwitchAPI.getClips({ id: '', token: '', username: '' }, ['testid'])
    const clipInfo = clips[0]
    expect(clipInfo.id).toEqual('testid')
    expect(clipInfo.title).toEqual('Test title')
    expect(clipInfo.broadcaster_name).toEqual('testbroadcast')
    expect(axios.get).toHaveBeenCalledTimes(1)
  })

  it('gets a twitch games from twitch api', async () => {
    const games = await TwitchAPI.getGames({ id: '', token: '', username: '' }, ['gameid'])
    const gameInfo = games[0]
    expect(gameInfo.id).toEqual('gameid')
    expect(gameInfo.name).toEqual('Test Game')
    expect(axios.get).toHaveBeenCalledTimes(2)
  })

  it('gets the common headers based on come ctx', () => {
    const ctx: TwitchUserCtx = { id: 'test', token: 'testToken' }
    expect(commonHeaders(ctx)).toEqual({
      'Client-ID': 'test',
      Authorization: `Bearer testToken`
    })
  })
})
