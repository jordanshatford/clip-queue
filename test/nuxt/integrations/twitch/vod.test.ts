import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockKickClip, mockTwitchClip, mockTwitchVod } from '~~/test/mocks'

import type { TwitchVideo } from '~/integrations/twitch/core/types'

import { TwitchVodProvider } from '~/integrations/twitch/vod'

vi.mock('~/integrations/twitch/core/api.ts', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('~/integrations/twitch/core/api')>()),
    getVideos: vi.fn<(_cId: string, _token: string, ids: string[]) => TwitchVideo[]>(
      (_cId: string, _token: string, ids: string[]) => {
        return ids.map((id) => ({ ...mockTwitchVod, id }))
      },
    ),
  }
})

const provider = new TwitchVodProvider(() => ({ clientId: '', accessToken: '' }))

describe('integrations/twitch/providers/vod', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    provider.clearCache()
  })

  it('knows its initial enabled state', () => {
    expect(provider.isEnabled.value).toEqual(false)
  })

  it('can be enabled and disabled', () => {
    provider.isEnabled.value = true
    expect(provider.isEnabled.value).toEqual(true)
    provider.isEnabled.value = false
    expect(provider.isEnabled.value).toEqual(false)
    provider.isEnabled.value = true
    expect(provider.isEnabled.value).toEqual(true)
  })

  it('gets the player config of the vod', async () => {
    const clip = await provider.resolveUrl(mockTwitchVod.url)
    expect(clip).toBeDefined()
    expect(provider.getPlayerConfigForClip(clip)).toEqual({
      type: 'iframe',
      src: `${clip.embedUrl}&autoplay=true&parent=${window.location.hostname}`,
      title: clip.title,
    })
  })

  it('gets the player config of the vod with a timestamp', async () => {
    const time = '1h20m5s'
    const url = `${mockTwitchVod.url}?t=${time}`
    const clip = await provider.resolveUrl(url)
    expect(clip).toBeDefined()
    expect(provider.getPlayerConfigForClip(clip)).toEqual({
      type: 'iframe',
      src: `${clip.embedUrl}&autoplay=true&parent=${window.location.hostname}&time=${time}`,
      title: clip.title,
    })
  })

  it('can get a video from a twitch url', async () => {
    const video = await provider.resolveUrl(mockTwitchVod.url)
    expect(video).toBeDefined()
    expect(video.id).toEqual(mockTwitchVod.id)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL', false],
    ['', false],
    [mockKickClip.clip_url, false],
    [mockTwitchVod.url, true],
    ['http://www.twitch.tv/channel/v/test?t=5m10s', true],
    ['http://www.twitch.tv/channel/v/test', true],
    ['https://www.twitch.tv/videos/test', true],
    [mockTwitchClip.url, false],
    ['https://m.twitch.tv/clip/testclip', false],
    ['https://clips.twitch.tv/channel/testclip', false],
    ['https://www.twitch.tv/channel/clip/testclip', false],
  ])('can detect clip urls it supports: (url: %s)', async (url: string, expected: boolean) => {
    expect(provider.hasSupportForUrl(url)).toEqual(expected)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockTwitchClip.url],
    [mockKickClip.clip_url],
  ])('throws an error for unknown video urls: (url: %s)', async (url: string) => {
    await expect(provider.resolveUrl(url)).rejects.toThrow(`Invalid URL: ${url}.`)
  })

  it('caches clip data that it fetchs', async () => {
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.resolveUrl(mockTwitchVod.url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    expect(await provider.resolveUrl(mockTwitchVod.url)).toBeDefined()
  })

  it('can have the cached data cleared', async () => {
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.resolveUrl(mockTwitchVod.url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    provider.clearCache()
    expect(provider.hasCachedData).toEqual(false)
  })
})
