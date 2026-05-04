import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mockKickClip, mockKickVod } from '../../../core/__tests__/mocks'
import { getClip, getVideo } from '../api'

describe('integrations/kick/core/api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn<typeof fetch>().mockImplementation((url) =>
      Promise.resolve({
        ok: true,
        json: () => {
          let data = {}
          if (url.toString().includes('clips')) {
            data = { clip: { ...mockKickClip, clip_url: url } }
          } else if (url.toString().includes('video')) {
            data = mockKickVod
          }
          return Promise.resolve(data)
        },
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

  it('gets a kick videos from kick api', async () => {
    const clip = await getVideo('testvod')
    expect(clip).toBeDefined()
    expect(clip?.uuid).toEqual('testkickvod')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('throws if no video ID is passed', async () => {
    await expect(getVideo('')).rejects.toThrow('Video ID was not provided.')
  })
})
