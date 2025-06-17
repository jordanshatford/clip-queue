import type { ChatUserstate } from 'tmi.js'
import { describe, expect, it } from 'vitest'

import { getClipIdFromUrl, isModerator, toURLParams } from '../utils'

describe('utils.ts', () => {
  it.each([
    [{ mod: true } as ChatUserstate, true],
    [{ mod: false } as ChatUserstate, false],
    [{ mod: false, badges: { broadcaster: '1' } } as ChatUserstate, true],
    [{ mod: false, badges: { broadcaster: '0' } } as ChatUserstate, false]
  ])(
    'can detect if a user is a moderator: (user: %o) -> %o',
    (user: ChatUserstate, expected: boolean) => {
      expect(isModerator(user)).toEqual(expected)
    }
  )

  it.each([
    [
      'https://clips.twitch.tv/TangibleFreezingPheasantPartyTime-jBBRudZqr_7KehsW',
      'TangibleFreezingPheasantPartyTime-jBBRudZqr_7KehsW'
    ],
    [
      'https://clips.twitch.tv/RockyDreamyDumplings4Head-FQpZsAzs89ihPF6I',
      'RockyDreamyDumplings4Head-FQpZsAzs89ihPF6I'
    ],
    [
      'https://clips.twitch.tv/FantasticQuaintWrenchPogChamp-seNiJaPPjYls0ID8',
      'FantasticQuaintWrenchPogChamp-seNiJaPPjYls0ID8'
    ],
    ['', undefined],
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL', undefined],
    ['https://m.twitch.tv/c/RockySteamyWalrusMoreCowbell-ZBrnUiZwQsENj3pi', undefined]
  ])(
    'can get a clip ID from a url: (url: %s) -> %s',
    (input: string, expected: string | undefined) => {
      expect(getClipIdFromUrl(input)).toEqual(expected)
    }
  )

  it.each([
    [
      'id',
      ['test1', 'test2', 'test3'],
      new URLSearchParams([
        ['id', 'test1'],
        ['id', 'test2'],
        ['id', 'test3']
      ])
    ],
    [
      'game_id',
      ['duplicate', 'duplicate', 'duplicate', 'new'],
      new URLSearchParams([
        ['game_id', 'duplicate'],
        ['game_id', 'duplicate'],
        ['game_id', 'duplicate'],
        ['game_id', 'new']
      ])
    ],
    [
      'broadcaster_id',
      ['user', 'user1', 'user2'],
      new URLSearchParams([
        ['broadcaster_id', 'user'],
        ['broadcaster_id', 'user1'],
        ['broadcaster_id', 'user2']
      ])
    ]
  ])(
    'creates url search params: (key: %s, values: %o) -> %o',
    (key: string, values: string[], expected: URLSearchParams) => {
      const p = toURLParams(key, values)
      expect(p.has(key)).toEqual(true)
      expect(p.getAll(key).length).toEqual(values.length)
      expect(p.toString()).toEqual(expected.toString())
    }
  )
})
