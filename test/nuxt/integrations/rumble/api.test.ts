import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getRumbleOEmbed } from '~/integrations/rumble/core/api'

import { mockRumbleOEmbed } from '../../../mocks'

describe('integrations/rumble/core/api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn<typeof fetch>().mockImplementation((url) =>
      Promise.resolve({
        ok: true,
        json: () => {
          return Promise.resolve({ ...mockRumbleOEmbed, author_url: url })
        },
      } as Response),
    )
  })

  it('gets rumble oembed information', async () => {
    const oembed = await getRumbleOEmbed('testclip')
    expect(oembed).toBeDefined()
    expect(oembed.provider_name).toEqual('Rumble')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('throws if no video URL is passed', async () => {
    await expect(getRumbleOEmbed('')).rejects.toThrow('URL was not provided.')
  })

  it('throws when the oembed fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    } as Response)

    await expect(getRumbleOEmbed('missing-video')).rejects.toThrow(
      'Failed to fetch OEmbed with URL https://rumble.com/api/Media/oembed?url=missing-video: Not Found',
    )
  })
})
