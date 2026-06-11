import { describe, expect, it } from 'vitest'

import { getYouTubeUrlDetails } from '~/integrations/youtube/core/utils'

type Details = ReturnType<typeof getYouTubeUrlDetails>

describe('integrations/youtube/core/utils', () => {
  it.each([
    ['https://www.youtube.com/shorts/testid', { type: 'short', id: 'testid' } as Details],
    ['https://www.youtube.com/watch?v=testid', { type: 'video', id: 'testid' } as Details],
    [
      'https://www.youtube.com/watch?v=testid2&t=123',
      { type: 'video', id: 'testid2', timestamp: '123' } as Details,
    ],
    ['https://youtu.be/test', { type: 'video', id: 'test' } as Details],
    ['https://youtu.be/test?t=456', { type: 'video', id: 'test', timestamp: '456' } as Details],
    [
      'https://www.youtube.com/watch',
      { type: 'video', id: undefined, timestamp: undefined } as Details,
    ],
  ])('can get youtube url details: (url: %s)', (input: string, expected: Details) => {
    expect(getYouTubeUrlDetails(input)).toEqual(expected)
  })
})
