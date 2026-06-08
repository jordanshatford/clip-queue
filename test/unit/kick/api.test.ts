import { beforeEach, describe, expect, it, vi } from 'vitest'

import { KickAPI } from '../../../shared/kick'
import { mockKickChannel, mockKickClip, mockKickVod } from './mocks'

const privateApi = vi.fn()

vi.mock('ofetch', () => ({
  ofetch: {
    create: vi.fn(() => privateApi),
  },
}))

describe('KickAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getClip', () => {
    it('fetches a clip', async () => {
      privateApi.mockResolvedValueOnce({
        clip: mockKickClip,
      })
      const api = new KickAPI()
      await expect(api.getClip(mockKickClip.id)).resolves.toEqual(mockKickClip)
      expect(privateApi).toHaveBeenCalledWith(`/v2/clips/${mockKickClip.id}`)
    })

    it('caches clips', async () => {
      privateApi.mockResolvedValue({
        clip: mockKickClip,
      })
      const api = new KickAPI()
      await api.getClip(mockKickClip.id)
      await api.getClip(mockKickClip.id)
      expect(privateApi).toHaveBeenCalledTimes(1)
    })

    it('throws if no clip id provided', async () => {
      const api = new KickAPI()
      await expect(api.getClip('')).rejects.toThrow('Clip ID was not provided.')
    })
  })

  describe('getVideo', () => {
    it('fetches a video', async () => {
      privateApi.mockResolvedValueOnce(mockKickVod)
      const api = new KickAPI()
      await expect(api.getVideo(mockKickVod.uuid)).resolves.toEqual(mockKickVod)
      expect(privateApi).toHaveBeenCalledWith(`/v1/video/${mockKickVod.uuid}`)
    })

    it('caches videos', async () => {
      privateApi.mockResolvedValue(mockKickVod)
      const api = new KickAPI()
      await api.getVideo(mockKickVod.uuid)
      await api.getVideo(mockKickVod.uuid)
      expect(privateApi).toHaveBeenCalledTimes(1)
    })

    it('throws if no video id provided', async () => {
      const api = new KickAPI()
      await expect(api.getVideo('')).rejects.toThrow('Video ID was not provided.')
    })
  })

  describe('getChannel', () => {
    it('fetches a channel', async () => {
      privateApi.mockResolvedValueOnce(mockKickChannel)
      const api = new KickAPI()
      await expect(api.getChannel(mockKickChannel.slug)).resolves.toEqual(mockKickChannel)
      expect(privateApi).toHaveBeenCalledWith(`/v2/channels/${mockKickChannel.slug}`)
    })

    it('caches channels', async () => {
      privateApi.mockResolvedValue(mockKickChannel)
      const api = new KickAPI()
      await api.getChannel(mockKickChannel.slug)
      await api.getChannel(mockKickChannel.slug)
      expect(privateApi).toHaveBeenCalledTimes(1)
    })

    it('throws if no channel name provided', async () => {
      const api = new KickAPI()
      await expect(api.getChannel('')).rejects.toThrow('Channel name was not provided.')
    })
  })
})
