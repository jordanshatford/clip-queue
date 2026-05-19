import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mockYouTubeOEmbed } from '../../../core/__tests__/mocks'
import { getYouTubeOEmbed } from '../api'

describe('integrations/youtube/core/api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn<typeof fetch>().mockImplementation((url) =>
      Promise.resolve({
        ok: true,
        json: () => {
          return Promise.resolve({ ...mockYouTubeOEmbed, author_url: url })
        },
      } as Response),
    )
  })

  it('gets youtube oembed information', async () => {
    const oembed = await getYouTubeOEmbed('testclip')
    expect(oembed).toBeDefined()
    expect(oembed.provider_name).toEqual('YouTube')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('throws if no video ID is passed', async () => {
    await expect(getYouTubeOEmbed('')).rejects.toThrow('ID was not provided.')
  })

  it('throws when the oembed fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    } as Response)

    await expect(getYouTubeOEmbed('missing-video')).rejects.toThrow(
      'Failed to fetch OEmbed with ID missing-video: Not Found',
    )
  })
})
