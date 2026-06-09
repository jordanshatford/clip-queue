import { describe, expect, it } from 'vitest'

import { parseEmbedURLFromHTML } from '../../../shared/oembed'
import { mockOEmbed } from './mocks'

describe('shared/oembed/utils', () => {
  it('parses the embed url from the oembed details', () => {
    expect(parseEmbedURLFromHTML(mockOEmbed)).toEqual('https://test-src-iframe.com/')
  })
})
