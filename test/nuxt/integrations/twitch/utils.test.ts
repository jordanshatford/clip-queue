import { describe, expect, it } from 'vitest'

import { isTwitchURL } from '~/integrations/twitch/core/utils'

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
})
