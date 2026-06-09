import { beforeEach, describe, expect, it, vi } from 'vitest'

import { KickAPI } from '../../../shared/kick'
import { mockKickClip, mockKickVod, mockKickChannel, mockKickUser } from './mocks'

const privateApi = vi.fn()
const publicApi = vi.fn()

vi.mock('ofetch', () => ({
  ofetch: {
    create: vi.fn((opts?: { baseURL: string }) => {
      if (opts?.baseURL?.includes('public')) {
        return publicApi
      }
      return privateApi
    }),
  },
}))

const mockAccessToken = () => 'token'

describe('shared/kick/api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getClip', () => {
    it('fetches a clip', async () => {
      privateApi.mockResolvedValueOnce({ clip: mockKickClip })
      const api = new KickAPI()
      await expect(api.getClip(mockKickClip.id)).resolves.toEqual(mockKickClip)
      expect(privateApi).toHaveBeenCalledWith(`/v2/clips/${mockKickClip.id}`)
    })

    it('caches clips', async () => {
      privateApi.mockResolvedValue({ clip: mockKickClip })
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
      await expect(api.getChannel('test')).resolves.toEqual(mockKickChannel)
      expect(privateApi).toHaveBeenCalledWith(`/v2/channels/test`)
    })

    it('caches channels', async () => {
      privateApi.mockResolvedValue(mockKickChannel)
      const api = new KickAPI()
      await api.getChannel('test')
      await api.getChannel('test')
      expect(privateApi).toHaveBeenCalledTimes(1)
    })

    it('throws if no channel provided', async () => {
      const api = new KickAPI()
      await expect(api.getChannel('')).rejects.toThrow('Channel name was not provided.')
    })
  })

  describe('getUser', () => {
    it('fetches a user by id', async () => {
      publicApi.mockResolvedValueOnce({
        data: [mockKickUser],
      })
      const api = new KickAPI(mockAccessToken)
      await expect(api.getUser('test')).resolves.toEqual(mockKickUser)
      expect(publicApi).toHaveBeenCalledWith('/v1/users', {
        query: { id: 'test' },
      })
    })

    it('fetches current user when no id provided', async () => {
      publicApi.mockResolvedValueOnce({
        data: [mockKickUser],
      })
      const api = new KickAPI(mockAccessToken)
      await expect(api.getUser()).resolves.toEqual(mockKickUser)
      expect(publicApi).toHaveBeenCalledWith('/v1/users', {
        query: { id: undefined },
      })
    })

    it('caches users', async () => {
      publicApi.mockResolvedValue({
        data: [mockKickUser],
      })
      const api = new KickAPI(mockAccessToken)
      await api.getUser('test')
      await api.getUser('test')
      expect(publicApi).toHaveBeenCalledTimes(1)
    })

    it('throws if no user or token provided', async () => {
      const api = new KickAPI()
      await expect(api.getUser()).rejects.toThrow('User ID or access token was not provided.')
    })

    it('throws if user not found', async () => {
      publicApi.mockResolvedValueOnce({
        data: [],
      })
      const api = new KickAPI(mockAccessToken)
      await expect(api.getUser('missing')).rejects.toThrow('User with ID missing does not exist.')
    })
  })
})
