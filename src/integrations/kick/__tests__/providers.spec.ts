import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { KickClip } from '@/integrations/kick'

import { clips as clipsProvider } from '@/integrations/kick'

import { mockKickClip, mockTwitchClip } from '../../common/__tests__/mocks'

vi.mock('@/integrations/kick/core/index.ts', async (importOriginal) => {
  return {
    default: {
      ...(await importOriginal<typeof import('@/integrations/kick/core')>()),
      getClip: vi.fn<(id: string) => KickClip>((id: string) => ({ ...mockKickClip, id })),
    },
  }
})

describe('kick.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clipsProvider.clearCache()
  })

  it('knows if it is an experimental provider', () => {
    expect(clipsProvider.isExperimental).toEqual(false)
  })

  it('gets the player format of the clip', () => {
    expect(clipsProvider.getPlayerFormat()).toEqual('video')
  })

  it('gets the player source of the clip', async () => {
    const clip = await clipsProvider.getClip(mockKickClip.clip_url)
    expect(clip).toBeDefined()
    expect(clipsProvider.getPlayerSource(clip)).toEqual(mockKickClip.clip_url)
  })

  it('can get a clip from a kick url', async () => {
    const clip = await clipsProvider.getClip(mockKickClip.clip_url)
    expect(clip).toBeDefined()
    expect(clip.id).toEqual(mockKickClip.id)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockTwitchClip.url],
  ])('throws an error for unknown clip urls: (url: %s)', async (url: string) => {
    await expect(clipsProvider.getClip(url)).rejects.toThrow('I')
  })

  it('caches clip data that it fetchs', async () => {
    expect(clipsProvider.hasCachedData).toEqual(false)
    expect(await clipsProvider.getClip(mockKickClip.clip_url)).toBeDefined()
    expect(clipsProvider.hasCachedData).toEqual(true)
  })

  it('can have the cached data cleared', async () => {
    expect(clipsProvider.hasCachedData).toEqual(false)
    expect(await clipsProvider.getClip(mockKickClip.clip_url)).toBeDefined()
    expect(clipsProvider.hasCachedData).toEqual(true)
    clipsProvider.clearCache()
    expect(clipsProvider.hasCachedData).toEqual(false)
  })
})
