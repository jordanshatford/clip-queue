import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockKickClip } from '~~/test/unit/kick/mocks'
import { mockTwitchClip, mockTwitchGame } from '~~/test/unit/twitch/mocks'

import { TwitchAPI } from '#shared/twitch'
import { TwitchClipProvider } from '~/integrations/twitch/clip'

const api = new TwitchAPI(() => ({ clientId: '', accessToken: '' }))
api.getClip = vi.fn().mockResolvedValue({
  ...mockTwitchClip,
})
api.getGame = vi.fn().mockResolvedValue({
  ...mockTwitchGame,
})
const provider = new TwitchClipProvider(api)

describe('integrations/twitch/providers/clip', () => {
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
    const clip = await provider.resolveUrl(mockTwitchClip.url)
    expect(clip).toBeDefined()
    expect(provider.getPlayerConfigForClip(clip)).toEqual({
      type: 'iframe',
      src: `${clip.embedUrl}?parent=${window.location.hostname}&autoplay=true&muted=false`,
      title: clip.title,
    })
  })

  it('can get a clip from a twitch url', async () => {
    const clip = await provider.resolveUrl(mockTwitchClip.url)
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
    expect(provider.hasSupportForUrl(url)).toEqual(expected)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockKickClip.clip_url],
  ])('throws an error for unknown clip urls: (url: %s)', async (url: string) => {
    await expect(provider.resolveUrl(url)).rejects.toThrow(`Invalid URL: ${url}.`)
  })

  it('caches clip data that it fetchs', async () => {
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.resolveUrl(mockTwitchClip.url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    expect(await provider.resolveUrl(mockTwitchClip.url)).toBeDefined()
  })

  it('can have the cached data cleared', async () => {
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.resolveUrl(mockTwitchClip.url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    provider.clearCache()
    expect(provider.hasCachedData).toEqual(false)
  })
})
