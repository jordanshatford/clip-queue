import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockKickClip, mockKickVod } from '~~/test/unit/kick/mocks'
import { mockOEmbed } from '~~/test/unit/oembed/mocks'
import { mockTwitchClip, mockTwitchVod } from '~~/test/unit/twitch/mocks'

import { OEmbedAPI } from '#shared/oembed'
import { StreamableProvider } from '~/integrations/misc/streamable'

const api = new OEmbedAPI()
api.getOEmbed = vi.fn().mockResolvedValue({
  ...mockOEmbed,
})
const provider = new StreamableProvider(api)

describe('integrations/misc/providers/streamable', () => {
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

  it('gets the player config of the video', async () => {
    const url = 'https://streamable.com/test'
    const video = await provider.resolveUrl(url)
    expect(video).toBeDefined()
    expect(provider.getPlayerConfigForClip(video)).toEqual({
      type: 'iframe',
      src: `${video.embedUrl}?autoplay=1`,
      title: video.title,
    })
  })

  it('can get a video from a streamable url', async () => {
    const url = 'https://streamable.com/test'
    const video = await provider.resolveUrl(url)
    expect(video).toBeDefined()
    expect(video.id).toEqual('test')
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL', false],
    ['', false],
    [mockKickClip.clip_url, false],
    [mockTwitchVod.url, false],
    ['http://www.twitch.tv/channel/v/test?t=5m10s', false],
    ['http://www.twitch.tv/channel/v/test', false],
    ['https://www.twitch.tv/videos/test', false],
    [mockTwitchClip.url, false],
    ['https://m.twitch.tv/clip/testclip', false],
    ['https://clips.twitch.tv/channel/testclip', false],
    ['https://www.twitch.tv/channel/clip/testclip', false],
    [`https://www.kick.com/channel/videos/${mockKickVod.uuid}`, false],
    [`https://www.kick.com/channel/videos/${mockKickVod.uuid}?t=123`, false],
    ['https://vimeo.com/test', false],
    ['https://vimeo.com/test#t=1m21s', false],
    ['https://vimeo.com/test#t=1m0s&end=2m1s', false],
    ['https://streamable.com/test', true],
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
    const url = 'https://streamable.com/test'
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.resolveUrl(url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    expect(await provider.resolveUrl(url)).toBeDefined()
  })

  it('can have the cached data cleared', async () => {
    const url = 'https://streamable.com/test'
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.resolveUrl(url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    provider.clearCache()
    expect(provider.hasCachedData).toEqual(false)
  })
})
