import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TwitchAPI } from '../../../shared/twitch'
import { mockTwitchClip, mockTwitchGame, mockTwitchUser, mockTwitchVod } from './mocks'

const mockAuth = () => ({ clientId: 'client-id', accessToken: 'token' })

const helix = vi.fn()

vi.mock('ofetch', () => ({
  ofetch: {
    create: vi.fn(() => helix),
  },
}))

describe('TwitchAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('isMisconfigued', () => {
    it.each([
      ['', '', true],
      ['client-id', '', true],
      ['', 'access-token', true],
      ['client-id', 'access-token', false],
    ])('returns %s when clientId=%s accessToken=%s', (clientId, accessToken, expected) => {
      const api = new TwitchAPI(() => ({ clientId, accessToken }))

      expect(api.isMisconfigued).toBe(expected)
    })
  })

  describe('getClip', () => {
    it('fetches a clip', async () => {
      helix.mockResolvedValueOnce({
        data: [mockTwitchClip],
      })
      const api = new TwitchAPI(mockAuth)
      await expect(api.getClip(mockTwitchClip.id)).resolves.toEqual(mockTwitchClip)
      expect(helix).toHaveBeenCalledWith('/clips', {
        query: { id: mockTwitchClip.id },
      })
    })

    it('caches clips', async () => {
      helix.mockResolvedValue({
        data: [mockTwitchClip],
      })
      const api = new TwitchAPI(mockAuth)
      await api.getClip(mockTwitchClip.id)
      await api.getClip(mockTwitchClip.id)
      expect(helix).toHaveBeenCalledTimes(1)
    })

    it('throws if no clip id provided', async () => {
      const api = new TwitchAPI(mockAuth)
      await expect(api.getClip('')).rejects.toThrow('Clip ID was not provided.')
    })

    it('throws if clip does not exist', async () => {
      helix.mockResolvedValueOnce({
        data: [],
      })
      const api = new TwitchAPI(mockAuth)
      await expect(api.getClip('missing')).rejects.toThrow('Clip with ID missing does not exist.')
    })
  })

  describe('getGame', () => {
    it('fetches a game', async () => {
      helix.mockResolvedValueOnce({
        data: [mockTwitchGame],
      })
      const api = new TwitchAPI(mockAuth)
      await expect(api.getGame(mockTwitchGame.id)).resolves.toEqual(mockTwitchGame)
      expect(helix).toHaveBeenCalledWith('/games', {
        query: { id: mockTwitchGame.id },
      })
    })

    it('caches games', async () => {
      helix.mockResolvedValue({
        data: [mockTwitchGame],
      })
      const api = new TwitchAPI(mockAuth)
      await api.getGame(mockTwitchGame.id)
      await api.getGame(mockTwitchGame.id)
      expect(helix).toHaveBeenCalledTimes(1)
    })

    it('throws if no game id provided', async () => {
      const api = new TwitchAPI(mockAuth)
      await expect(api.getGame('')).rejects.toThrow('Game ID was not provided.')
    })

    it('throws if game does not exist', async () => {
      helix.mockResolvedValueOnce({
        data: [],
      })
      const api = new TwitchAPI(mockAuth)
      await expect(api.getGame('missing')).rejects.toThrow('Game with ID missing does not exist.')
    })
  })

  describe('getVideo', () => {
    it('fetches a video', async () => {
      helix.mockResolvedValueOnce({
        data: [mockTwitchVod],
      })
      const api = new TwitchAPI(mockAuth)
      await expect(api.getVideo(mockTwitchVod.id)).resolves.toEqual(mockTwitchVod)
      expect(helix).toHaveBeenCalledWith('/videos', {
        query: { id: mockTwitchVod.id },
      })
    })

    it('caches videos', async () => {
      helix.mockResolvedValue({
        data: [mockTwitchVod],
      })
      const api = new TwitchAPI(mockAuth)
      await api.getVideo(mockTwitchVod.id)
      await api.getVideo(mockTwitchVod.id)
      expect(helix).toHaveBeenCalledTimes(1)
    })

    it('throws if no video id provided', async () => {
      const api = new TwitchAPI(mockAuth)
      await expect(api.getVideo('')).rejects.toThrow('Video ID was not provided.')
    })

    it('throws if video does not exist', async () => {
      helix.mockResolvedValueOnce({
        data: [],
      })
      const api = new TwitchAPI(mockAuth)
      await expect(api.getVideo('missing')).rejects.toThrow('Video with ID missing does not exist.')
    })
  })

  describe('getUser', () => {
    it('fetches a user', async () => {
      helix.mockResolvedValueOnce({
        data: [mockTwitchUser],
      })
      const api = new TwitchAPI(mockAuth)
      await expect(api.getUser(mockTwitchUser.id)).resolves.toEqual(mockTwitchUser)
      expect(helix).toHaveBeenCalledWith('/users', {
        query: { id: mockTwitchUser.id },
      })
    })

    it('fetches the current user', async () => {
      helix.mockResolvedValueOnce({
        data: [mockTwitchUser],
      })
      const api = new TwitchAPI(mockAuth)
      await expect(api.getUser()).resolves.toEqual(mockTwitchUser)
      expect(helix).toHaveBeenCalledWith('/users', {
        query: { id: undefined },
      })
    })

    it('caches users', async () => {
      helix.mockResolvedValue({
        data: [mockTwitchUser],
      })
      const api = new TwitchAPI(mockAuth)
      await api.getUser(mockTwitchUser.id)
      await api.getUser(mockTwitchUser.id)
      expect(helix).toHaveBeenCalledTimes(1)
    })

    it('throws if user does not exist', async () => {
      helix.mockResolvedValueOnce({
        data: [],
      })
      const api = new TwitchAPI(mockAuth)
      await expect(api.getUser('missing')).rejects.toThrow('User with ID missing does not exist.')
    })
  })
})
