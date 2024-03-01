import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockKickClip, mockTwitchClip } from '@/__tests__/mocks'
import { KickProvider } from '../kick'

vi.mock('@/services/kick', async (importOriginal) => {
  return {
    default: {
      ...(await importOriginal<typeof import('@/services/kick')>()),
      getClip: vi.fn((id: string) => ({ ...mockKickClip, id }))
    }
  }
})

describe('kick.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gets the player format of the clip', () => {
    const kickProvider = new KickProvider()
    expect(kickProvider.getPlayerFormat()).toEqual('video')
  })

  it('gets the player source of the clip', async () => {
    const kickProvider = new KickProvider()
    const c = await kickProvider.getClip(mockKickClip.clip_url)
    expect(c).toBeDefined()
    if (c) {
      expect(kickProvider.getPlayerSource(c)).toEqual(mockKickClip.clip_url)
    }
  })

  it('can get a clip from a kick url', async () => {
    const kickProvider = new KickProvider()
    const c = await kickProvider.getClip(mockKickClip.clip_url)
    expect(c).toBeDefined()
    expect(c?.id).toEqual(mockKickClip.id)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockTwitchClip.url]
  ])('returns undefined for unknown clip urls', async (url: string) => {
    const kickProvider = new KickProvider()
    expect(await kickProvider.getClip(url)).toBeUndefined()
  })

  it('caches clip data that it fetchs', async () => {
    const kickProvider = new KickProvider()
    expect(kickProvider.hasCachedData).toEqual(false)
    expect(await kickProvider.getClip(mockKickClip.clip_url)).toBeDefined()
    expect(kickProvider.hasCachedData).toEqual(true)
  })

  it('can have the cached data cleared', async () => {
    const kickProvider = new KickProvider()
    expect(kickProvider.hasCachedData).toEqual(false)
    expect(await kickProvider.getClip(mockKickClip.clip_url)).toBeDefined()
    expect(kickProvider.hasCachedData).toEqual(true)
    kickProvider.clearCache()
    expect(kickProvider.hasCachedData).toEqual(false)
  })
})
