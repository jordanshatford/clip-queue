import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mockOEmbed } from '../../../core/__tests__/mocks'
import { getOEmbed, getOEmbedProxied } from '../api'

describe('integrations/misc/core/api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn<typeof fetch>().mockImplementation((url) =>
      Promise.resolve({
        ok: true,
        json: () => {
          return Promise.resolve({ ...mockOEmbed, provider_url: url })
        },
      } as Response),
    )
  })

  it('gets oembed details from a URL', async () => {
    const oembed = await getOEmbed('https://api.oembed.com/oembed.json?url=https://some.com/url')
    expect(oembed).toBeDefined()
    expect(oembed.title).toBeDefined()
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('throws if no oembed URL is passed', async () => {
    await expect(getOEmbed('')).rejects.toThrow('URL was not provided.')
  })

  it('gets oembed details from a URL but proxied', async () => {
    const oembed = await getOEmbedProxied(
      'https://api.oembed.com/oembed.json?url=https://some.com/url',
    )
    expect(oembed).toBeDefined()
    expect(oembed.title).toBeDefined()
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('throws if no oembed URL is passed when proxied', async () => {
    await expect(getOEmbedProxied('')).rejects.toThrow('URL was not provided.')
  })
})
