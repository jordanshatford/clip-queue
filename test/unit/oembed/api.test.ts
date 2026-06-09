import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { OEmbedVideoResponse } from '../../../shared/oembed'

import { OEmbedAPI } from '../../../shared/oembed'
import { mockOEmbed } from './mocks'

const mockVideoOEmbed: OEmbedVideoResponse = mockOEmbed

const $fetchMock = vi.fn()

vi.stubGlobal('$fetch', $fetchMock)

describe('OEmbedAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getOEmbed', () => {
    it('throws if url is empty', async () => {
      const api = new OEmbedAPI()
      await expect(api.getOEmbed('')).rejects.toThrow('URL was not provided.')
    })

    it('fetches a proxied provider', async () => {
      $fetchMock.mockResolvedValueOnce(mockVideoOEmbed)
      const api = new OEmbedAPI()
      const result = await api.getOEmbed('https://medal.tv/games/test/clips/test')
      expect(result).toEqual(mockVideoOEmbed)
      expect($fetchMock).toHaveBeenCalledWith(
        '/api/oembed/proxy',
        expect.objectContaining({
          query: {
            url: expect.stringContaining('https://medal.tv/api/oembed'),
          },
        }),
      )
    })

    it('fetches a non-proxied provider', async () => {
      $fetchMock.mockResolvedValueOnce(mockVideoOEmbed)
      const api = new OEmbedAPI()
      const result = await api.getOEmbed('https://vimeo.com/12345')
      expect(result).toEqual(mockVideoOEmbed)
      expect($fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('https://vimeo.com/api/oembed.json'),
      )
    })

    it('throws when oembed is not a video', async () => {
      $fetchMock.mockResolvedValueOnce({
        type: 'link',
        version: '1.0',
      })
      const api = new OEmbedAPI()
      await expect(api.getOEmbed('https://vimeo.com/12345')).rejects.toThrow(
        'OEmbed is not a video for URL: https://vimeo.com/12345.',
      )
    })

    it('caches results', async () => {
      $fetchMock.mockResolvedValue(mockVideoOEmbed)
      const api = new OEmbedAPI()
      await api.getOEmbed('https://vimeo.com/12345')
      await api.getOEmbed('https://vimeo.com/12345')
      expect($fetchMock).toHaveBeenCalledTimes(1)
    })

    it('does not cache different urls', async () => {
      $fetchMock.mockResolvedValue(mockVideoOEmbed)
      const api = new OEmbedAPI()
      await api.getOEmbed('https://vimeo.com/12345')
      await api.getOEmbed('https://vimeo.com/67890')
      expect($fetchMock).toHaveBeenCalledTimes(2)
    })
  })
})
