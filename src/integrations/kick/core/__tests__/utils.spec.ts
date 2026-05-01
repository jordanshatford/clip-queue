import { describe, expect, it } from 'vitest'

import { isKickURL } from '../utils'

describe('integrations/kick/core/utils', () => {
  it.each([
    [new URL('https://kick.com/test'), true],
    [new URL('https://kick.com/testchannel/clip/testclip'), true],
    [new URL('https://kick.com/'), true],
    [new URL('https://twitch.tv/c/testchannel'), false],
    [new URL('https://google.ca'), false],
  ])('can detect if a url is a kick url: (url: %s) -> %s', (input: URL, expected: boolean) => {
    expect(isKickURL(input)).toEqual(expected)
  })
})
