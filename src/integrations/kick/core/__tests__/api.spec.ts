import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mockKickClip } from '../../../core/__tests__/mocks'
import { getClip } from '../api'

describe('integrations/kick/core/api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn<typeof fetch>().mockImplementation((url) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            clip: {
              ...mockKickClip,
              clip_url: url,
            },
          }),
      } as Response),
    )
  })

  it('gets a kick clip from kick api', async () => {
    const clip = await getClip('testclip')
    expect(clip).toBeDefined()
    expect(clip?.id).toEqual('testclip')
    expect(clip?.title).toEqual('testtitle')
    expect(clip?.channel.username).toEqual('testchannel')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('throws if no clip ID is passed', async () => {
    await expect(getClip('')).rejects.toThrow('Clip ID was not provided.')
  })
})
