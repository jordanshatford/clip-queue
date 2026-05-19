import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { TwitchClip, TwitchGame } from '../../core/types'

import { mockKickClip, mockTwitchClip, mockTwitchGame } from '../../../core/__tests__/mocks'
import { TwitchClipProvider } from '../clip'

vi.mock('@/integrations/twitch/core/api.ts', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/integrations/twitch/core/api')>()),
    getClips: vi.fn<(_cId: string, _token: string, ids: string[]) => TwitchClip[]>(
      (_cId: string, _token: string, ids: string[]) => {
        return ids.map((id) => ({ ...mockTwitchClip, id }))
      },
    ),
    getGames: vi.fn<(_cId: string, _token: string, ids: string[]) => TwitchGame[]>(
      (_cId: string, _token: string, ids: string[]) => {
        return ids.map((id) => ({ ...mockTwitchGame, id }))
      },
    ),
  }
})

const provider = new TwitchClipProvider(() => '')

describe('integrations/twitch/providers/clip', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    provider.clearCache()
  })

  it('knows if it is an experimental provider', () => {
    expect(provider.isExperimental).toEqual(false)
  })

  it('knows its initial enabled state', () => {
    expect(provider.isEnabled).toEqual(true)
  })

  it('can be enabled and disabled', () => {
    provider.isEnabled = true
    expect(provider.isEnabled).toEqual(true)
    provider.isEnabled = false
    expect(provider.isEnabled).toEqual(false)
    provider.isEnabled = true
    expect(provider.isEnabled).toEqual(true)
  })

  it('gets the player config of the clip', async () => {
    const clip = await provider.getClip(mockTwitchClip.url)
    expect(clip).toBeDefined()
    expect(provider.getPlayerConfig(clip)).toEqual({
      type: 'iframe',
      src: `${clip.embedUrl}&autoplay=true&parent=${window.location.hostname}`,
      title: clip.title,
    })
  })

  it('can get a clip from a twitch url', async () => {
    const clip = await provider.getClip(mockTwitchClip.url)
    expect(clip).toBeDefined()
    expect(clip.id).toEqual(mockTwitchClip.id)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL', false],
    ['', false],
    [mockKickClip.clip_url, false],
    ['http://www.twitch.tv/channel/v/test?t=5m10s', false],
    ['http://www.twitch.tv/channel/v/test', false],
    ['https://www.twitch.tv/videos/test', false],
    [mockTwitchClip.url, true],
    ['https://m.twitch.tv/clip/testclip', true],
    ['https://clips.twitch.tv/channel/testclip', true],
    ['https://www.twitch.tv/channel/clip/testclip', true],
  ])('can detect clip urls it supports: (url: %s)', async (url: string, expected: boolean) => {
    expect(provider.hasClipSupport(url)).toEqual(expected)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockKickClip.clip_url],
  ])('throws an error for unknown clip urls: (url: %s)', async (url: string) => {
    await expect(provider.getClip(url)).rejects.toThrow(
      `[Twitch Clips]: Invalid clip URL (${url}).`,
    )
  })

  it('caches clip data that it fetchs', async () => {
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(mockTwitchClip.url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    expect(await provider.getClip(mockTwitchClip.url)).toBeDefined()
  })

  it('can have the cached data cleared', async () => {
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(mockTwitchClip.url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    provider.clearCache()
    expect(provider.hasCachedData).toEqual(false)
  })
})
