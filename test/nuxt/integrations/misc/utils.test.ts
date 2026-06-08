import { describe, expect, it } from 'vitest'
import { mockOEmbed } from '~~/test/mocks'

import { toEmbedUrl } from '~/integrations/misc/core/utils'

describe('integrations/misc/core/utils', () => {
  it('parses the embed url from the oembed details', () => {
    expect(toEmbedUrl(mockOEmbed)).toEqual('https://test-src-iframe.com/')
  })
})
