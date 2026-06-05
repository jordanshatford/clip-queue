import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockKickClip, mockKickVod } from '~~/test/mocks'

import { getClip, getVideo } from '~/integrations/kick/core/api'

const $fetchMock = vi.fn()

describe('integrations/kick/core/api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('$fetch', $fetchMock)
    $fetchMock.mockResolvedValue({ clip: mockKickClip })
  })

  it('gets a kick clip from kick api', async () => {
    $fetchMock.mockResolvedValueOnce({ clip: mockKickClip })
    const clip = await getClip('testclip')
    expect(clip).toBeDefined()
    expect(clip?.id).toEqual('testclip')
    expect(clip?.title).toEqual('testtitle')
    expect(clip?.channel.username).toEqual('testchannel')
    expect($fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws if no clip ID is passed', async () => {
    await expect(getClip('')).rejects.toThrow('Clip ID was not provided.')
  })

  it('throws when the clip fetch fails', async () => {
    $fetchMock.mockRejectedValueOnce(new Error('Unknown Error'))
    await expect(getClip('missing-clip')).rejects.toThrow('Unknown Error')
  })

  it('gets a kick videos from kick api', async () => {
    $fetchMock.mockResolvedValueOnce(mockKickVod)
    const clip = await getVideo('testvod')
    expect(clip).toBeDefined()
    expect(clip?.uuid).toEqual('testkickvod')
    expect($fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws if no video ID is passed', async () => {
    await expect(getVideo('')).rejects.toThrow('Video ID was not provided.')
  })

  it('throws when the video fetch fails', async () => {
    $fetchMock.mockRejectedValueOnce(new Error('Unknown Error'))
    await expect(getVideo('missing-video')).rejects.toThrow('Unknown Error')
  })
})
