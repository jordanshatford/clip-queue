import { describe, expect, it } from 'vitest'

import { isTwitchURL, toURLParams } from '../utils'

describe('integrations/twitch/core/utils', () => {
  it.each([
    [new URL('https://clips.twitch.tv/testclip'), true],
    [new URL('https://twitch.tv/testchannel/clip/testclip'), true],
    [new URL('https://clips.twitch.tv/testchannel/video/testvideo'), true],
    [new URL('https://twitch.tv/'), true],
    [new URL('https://m.twitch.tv/c/testchannel'), true],
    [new URL('https://google.ca'), false],
  ])('can detect if a url is a twitch url: (url: %s) -> %s', (input: URL, expected: boolean) => {
    expect(isTwitchURL(input)).toEqual(expected)
  })

  it.each([
    [
      'id',
      ['test1', 'test2', 'test3'],
      new URLSearchParams([
        ['id', 'test1'],
        ['id', 'test2'],
        ['id', 'test3'],
      ]),
    ],
    [
      'game_id',
      ['duplicate', 'duplicate', 'duplicate', 'new'],
      new URLSearchParams([
        ['game_id', 'duplicate'],
        ['game_id', 'duplicate'],
        ['game_id', 'duplicate'],
        ['game_id', 'new'],
      ]),
    ],
    [
      'broadcaster_id',
      ['user', 'user1', 'user2'],
      new URLSearchParams([
        ['broadcaster_id', 'user'],
        ['broadcaster_id', 'user1'],
        ['broadcaster_id', 'user2'],
      ]),
    ],
  ])(
    'creates url search params: (key: %s, values: %o) -> %o',
    (key: string, values: string[], expected: URLSearchParams) => {
      const p = toURLParams(key, values)
      expect(p.has(key)).toEqual(true)
      expect(p.getAll(key).length).toEqual(values.length)
      expect(p.toString()).toEqual(expected.toString())
    },
  )
})
