import { beforeEach, describe, expect, it, vi } from 'vitest'

import { KickProvider } from '../kick'
import { mockKickClip, mockTwitchClip } from './mocks'

vi.mock('@cq/services/kick', async (importOriginal) => {
  return {
    default: {
      ...(await importOriginal<typeof import('@cq/services/kick')>()),
      getClip: vi.fn((id: string) => ({ ...mockKickClip, id }))
    }
  }
})

describe('kick.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('knows if it is an experimental provider', () => {
    const provider = new KickProvider()
    expect(provider.isExperimental).toEqual(false)
  })

  it('gets the player format of the clip', () => {
    const provider = new KickProvider()
    expect(provider.getPlayerFormat()).toEqual('video')
  })

  it('gets the player source of the clip', async () => {
    const provider = new KickProvider()
    const clip = await provider.getClip(mockKickClip.clip_url)
    expect(clip).toBeDefined()
    expect(provider.getPlayerSource(clip)).toEqual(mockKickClip.clip_url)
  })

  it('can get a clip from a kick url', async () => {
    const provider = new KickProvider()
    const clip = await provider.getClip(mockKickClip.clip_url)
    expect(clip).toBeDefined()
    expect(clip.id).toEqual(mockKickClip.id)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockTwitchClip.url]
  ])('throws an error for unknown clip urls: (url: %s)', async (url: string) => {
    const provider = new KickProvider()
    expect(provider.getClip(url)).rejects.toThrowError()
  })

  it('caches clip data that it fetchs', async () => {
    const provider = new KickProvider()
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(mockKickClip.clip_url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
  })

  it('can have the cached data cleared', async () => {
    const provider = new KickProvider()
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(mockKickClip.clip_url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    provider.clearCache()
    expect(provider.hasCachedData).toEqual(false)
  })
})
