import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockYouTubeOEmbed } from '~~/test/mocks'

import { getYouTubeOEmbed } from '~/integrations/youtube/core/api'

const $fetchMock = vi.fn()

describe('integrations/youtube/core/api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('$fetch', $fetchMock)
    $fetchMock.mockResolvedValue({ ...mockYouTubeOEmbed, author_url: 'https://youtube.com' })
  })

  it('gets youtube oembed information', async () => {
    const oembed = await getYouTubeOEmbed('testclip')
    expect(oembed).toBeDefined()
    expect(oembed.provider_name).toEqual('YouTube')
    expect($fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws if no video ID is passed', async () => {
    await expect(getYouTubeOEmbed('')).rejects.toThrow('ID was not provided.')
  })

  it('throws when the oembed fetch fails', async () => {
    $fetchMock.mockRejectedValueOnce(new Error('Unknown Error'))
    await expect(getYouTubeOEmbed('missing-video')).rejects.toThrow('Unknown Error')
  })
})
