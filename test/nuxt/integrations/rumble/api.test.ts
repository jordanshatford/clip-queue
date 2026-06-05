import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockRumbleOEmbed } from '~~/test/mocks'

import { getRumbleOEmbed } from '~/integrations/rumble/core/api'

describe('integrations/rumble/core/api (Nuxt 4)', () => {
  const $fetchMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('$fetch', $fetchMock)
    $fetchMock.mockResolvedValue({
      ...mockRumbleOEmbed,
      author_url: 'https://rumble.com/testclip',
    })
  })

  it('returns rumble oembed data', async () => {
    const result = await getRumbleOEmbed('testclip')
    expect(result).toBeDefined()
    expect(result.provider_name).toBe('Rumble')
    expect($fetchMock).toHaveBeenCalledTimes(1)
  })

  it('passes correct oembed URL to proxy', async () => {
    await getRumbleOEmbed('testclip')
    expect($fetchMock).toHaveBeenCalledWith(
      '/api/oembed/proxy',
      expect.objectContaining({
        query: {
          url: 'https://rumble.com/api/Media/oembed?url=testclip',
        },
      }),
    )
  })

  it('throws if no video URL is passed', async () => {
    await expect(getRumbleOEmbed('')).rejects.toThrow('URL was not provided.')
  })

  it('handles fetch failure', async () => {
    $fetchMock.mockRejectedValueOnce(new Error('Failed to fetch OEmbed'))
    await expect(getRumbleOEmbed('missing-video')).rejects.toThrow('Failed to fetch OEmbed')
  })
})
