import { describe, expect, it } from 'vitest'

import { getRumbleUrlDetails, toEmbedUrl } from '~/integrations/rumble/core/utils'

import { mockOEmbed } from '../core/mocks'

type Details = ReturnType<typeof getRumbleUrlDetails>

describe('integrations/rumble/core/utils', () => {
  it.each([
    ['https://rumble.com/shorts/testid', { type: 'short', id: 'testid' } as Details],
    ['https://rumble.com/embed/testid', { type: 'video', id: 'testid' } as Details],
    [
      'https://rumble.com/embed/testid?start=456',
      { type: 'video', id: 'testid', timestamp: '456' } as Details,
    ],
    [
      'https://rumble.com/testid-some-name.html',
      { type: 'video', id: 'testid-some-name.html' } as Details,
    ],
    [
      'https://rumble.com/testid-some-name.html?start=123',
      { type: 'video', id: 'testid-some-name.html', timestamp: '123' } as Details,
    ],
  ])('can get rumble url details: (url: %s)', (input: string, expected: Details) => {
    expect(getRumbleUrlDetails(input)).toEqual(expected)
  })

  it('parses the embed url from the oembed details', () => {
    expect(toEmbedUrl(mockOEmbed)).toEqual('https://test-src-iframe.com')
  })
})
