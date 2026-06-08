import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockKickClip } from '~~/test/mocks'
import { mockTwitchClip } from '~~/test/unit/twitch/mocks'

import type { KickClip } from '~/integrations/kick/core/types'

import { KickClipsProvider } from '~/integrations/kick/clip'

vi.mock('~/integrations/kick/core/api', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('~/integrations/kick/core/api')>()),
    getClip: vi.fn<(id: string) => KickClip>((id: string) => ({ ...mockKickClip, id })),
  }
})

const provider = new KickClipsProvider()

describe('integrations/kick/providers/clip', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    provider.clearCache()
  })

  it('knows its initial enabled state', () => {
    expect(provider.isEnabled.value).toEqual(true)
  })

  it('can be enabled and disabled', () => {
    provider.isEnabled.value = true
    expect(provider.isEnabled.value).toEqual(true)
    provider.isEnabled.value = false
    expect(provider.isEnabled.value).toEqual(false)
    provider.isEnabled.value = true
    expect(provider.isEnabled.value).toEqual(true)
  })

  it('gets the player config of the clip', async () => {
    const clip = await provider.resolveUrl(mockKickClip.clip_url)
    expect(clip).toBeDefined()
    expect(provider.getPlayerConfigForClip(clip)).toEqual({
      type: 'video',
      src: clip.embedUrl,
      title: clip.title,
      poster: clip.thumbnailUrl,
    })
  })

  it('can get a clip from a kick url', async () => {
    const clip = await provider.resolveUrl(mockKickClip.clip_url)
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
    ['https://kick.com/<CHANNEL>/clips/clip_ABC', true],
    ['https://kick.com/test?clip=clip_01HQ7ZWTEKKJP16Y34SDFF2SBC', true],
    ['https://kick.com/test?somenonclipparam=123', false],
  ])('can detect clip urls it supports: (url: %s)', async (url: string, expected: boolean) => {
    expect(provider.hasSupportForUrl(url)).toEqual(expected)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockTwitchClip.url],
  ])('throws an error for unknown clip urls: (url: %s)', async (url: string) => {
    await expect(provider.resolveUrl(url)).rejects.toThrow(`Invalid URL: ${url}.`)
  })

  it('caches clip data that it fetchs', async () => {
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.resolveUrl(mockKickClip.clip_url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    expect(await provider.resolveUrl(mockKickClip.clip_url)).toBeDefined()
  })

  it('can have the cached data cleared', async () => {
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.resolveUrl(mockKickClip.clip_url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    provider.clearCache()
    expect(provider.hasCachedData).toEqual(false)
  })
})
