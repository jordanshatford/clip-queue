import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { KickClip } from '../../core/types'

import { mockKickClip, mockTwitchClip } from '../../../core/__tests__/mocks'
import { KickClipsProvider } from '../clip'

vi.mock('@/integrations/kick/core/api', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/integrations/kick/core/api')>()),
    getClip: vi.fn<(id: string) => KickClip>((id: string) => ({ ...mockKickClip, id })),
  }
})

const provider = new KickClipsProvider()

describe('integrations/kick/providers/clip', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    provider.clearCache()
  })

  it('knows if it is an experimental provider', () => {
    expect(provider.isExperimental).toEqual(false)
  })

  it('gets the player format of the clip', () => {
    expect(provider.getPlayerFormat()).toEqual('video')
  })

  it('gets the player source of the clip', async () => {
    const clip = await provider.getClip(mockKickClip.clip_url)
    expect(clip).toBeDefined()
    expect(provider.getPlayerSource(clip)).toEqual(mockKickClip.clip_url)
  })

  it('can get a clip from a kick url', async () => {
    const clip = await provider.getClip(mockKickClip.clip_url)
    expect(clip).toBeDefined()
    expect(clip.id).toEqual(mockKickClip.id)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL', false],
    ['', false],
    [mockKickClip.clip_url, true],
    [mockTwitchClip.url, false],
    ['https://kick.com/channel?clip=clip_ABC', true],
    ['https://kick.com/channel/clip/clip_ABC', true],
    ['https://kick.com/test?clip=clip_01HQ7ZWTEKKJP16Y34SDFF2SBC', true],
    ['https://kick.com/test?somenonclipparam=123', false],
  ])('can detect clip urls it supports: (url: %s)', async (url: string, expected: boolean) => {
    expect(provider.hasClipSupport(url)).toEqual(expected)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockTwitchClip.url],
  ])('throws an error for unknown clip urls: (url: %s)', async (url: string) => {
    await expect(provider.getClip(url)).rejects.toThrow('I')
  })

  it('caches clip data that it fetchs', async () => {
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(mockKickClip.clip_url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
  })

  it('can have the cached data cleared', async () => {
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(mockKickClip.clip_url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    provider.clearCache()
    expect(provider.hasCachedData).toEqual(false)
  })
})
