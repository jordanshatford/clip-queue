import { describe, expect, it } from 'vitest'

import { isYouTubeURL, getYouTubeUrlDetails } from '../utils'

type Details = ReturnType<typeof getYouTubeUrlDetails>

describe('integrations/youtube/core/utils', () => {
  it.each([
    [new URL('https://kick.com/test'), false],
    [new URL('https://kick.com/testchannel/clip/testclip'), false],
    [new URL('https://kick.com/'), false],
    [new URL('https://twitch.tv/c/testchannel'), false],
    [new URL('https://google.ca'), false],
    [new URL('https://www.youtube.com/shorts/id'), true],
    [new URL('https://www.youtube.com/watch?v=id'), true],
    [new URL('https://www.youtube.com/watch?v=id&t=123'), true],
    [new URL('https://youtu.be/id'), true],
    [new URL('https://youtu.be/id?t=456'), true],
  ])('can detect if a url is a youtube url: (url: %s) -> %s', (input: URL, expected: boolean) => {
    expect(isYouTubeURL(input)).toEqual(expected)
  })

  it.each([
    ['https://www.youtube.com/shorts/testid', { type: 'short', id: 'testid' } as Details],
    ['https://www.youtube.com/watch?v=testid', { type: 'video', id: 'testid' } as Details],
    [
      'https://www.youtube.com/watch?v=testid2&t=123',
      { type: 'video', id: 'testid2', timestamp: '123' } as Details,
    ],
    ['https://youtu.be/test', { type: 'video', id: 'test' } as Details],
    ['https://youtu.be/test?t=456', { type: 'video', id: 'test', timestamp: '456' } as Details],
  ])('can get youtube url details: (url: %s)', (input: string, expected: Details) => {
    expect(getYouTubeUrlDetails(input)).toEqual(expected)
  })
})
