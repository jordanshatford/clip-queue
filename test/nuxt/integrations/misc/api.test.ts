import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockOEmbed } from '~~/test/mocks'

import { getOEmbed, getOEmbedProxied } from '~/integrations/misc/core/api'

const fetchMock = vi.fn()
const $fetchMock = vi.fn()

describe('integrations/misc/core/api', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        ...mockOEmbed,
        provider_url: 'https://example.com',
      }),
    })

    vi.stubGlobal('$fetch', $fetchMock)
    $fetchMock.mockResolvedValue({
      ...mockOEmbed,
      provider_url: 'https://example.com',
    })
  })

  it('gets oembed details from a URL', async () => {
    const oembed = await getOEmbed('https://api.oembed.com/oembed.json?url=https://some.com/url')
    expect(oembed).toBeDefined()
    expect(oembed.title).toBeDefined()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws if no oembed URL is passed', async () => {
    await expect(getOEmbed('')).rejects.toThrow('URL was not provided.')
  })

  it('throws when the oembed fetch fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      statusText: 'Forbidden',
    })
    await expect(getOEmbed('https://example.com/oembed')).rejects.toThrow(
      'Failed to fetch OEmbed with URL https://example.com/oembed: Forbidden',
    )
  })

  it('gets oembed details from a URL but proxied', async () => {
    const oembed = await getOEmbedProxied(
      'https://api.oembed.com/oembed.json?url=https://some.com/url',
    )
    expect(oembed).toBeDefined()
    expect(oembed.title).toBeDefined()
    expect($fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws if no oembed URL is passed when proxied', async () => {
    await expect(getOEmbedProxied('')).rejects.toThrow('URL was not provided.')
  })

  it('throws when the proxied fetch fails', async () => {
    $fetchMock.mockRejectedValueOnce(new Error('Bad Gateway'))
    await expect(getOEmbedProxied('https://example.com/oembed')).rejects.toThrow('Bad Gateway')
  })
})
