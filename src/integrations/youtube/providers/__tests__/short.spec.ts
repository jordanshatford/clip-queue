import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { OEmbedResponse } from '../../core/types'

import {
  mockKickClip,
  mockTwitchClip,
  mockTwitchVod,
  mockYouTubeOEmbed,
} from '../../../core/__tests__/mocks'
import { YouTubeShortProvider } from '../short'

vi.mock('@/integrations/youtube/core/api.ts', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/integrations/youtube/core/api')>()),
    getYouTubeOEmbed: vi.fn<(id: string) => OEmbedResponse>((id: string) => {
      return { ...mockYouTubeOEmbed, version: id }
    }),
  }
})

const provider = new YouTubeShortProvider()

describe('integrations/youtube/providers/short', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    provider.clearCache()
  })

  it('knows if it is an experimental provider', () => {
    expect(provider.isExperimental).toEqual(false)
  })

  it('can be enabled and disabled', () => {
    provider.isEnabled = true
    expect(provider.isEnabled).toEqual(true)
    provider.isEnabled = false
    expect(provider.isEnabled).toEqual(false)
    provider.isEnabled = true
    expect(provider.isEnabled).toEqual(true)
  })

  it('gets the player config of the short', async () => {
    const url = 'https://www.youtube.com/shorts/testshort'
    const clip = await provider.getClip(url)
    expect(clip).toBeDefined()
    expect(provider.getPlayerConfig(clip)).toEqual({
      type: 'iframe',
      src: `${clip.embedUrl}/${clip.id}?autoplay=true`,
      title: clip.title,
    })
  })

  it('can get a short from a youtube url', async () => {
    const url = 'https://www.youtube.com/shorts/testshort'
    const video = await provider.getClip(url)
    expect(video).toBeDefined()
    expect(video.id).toEqual('testshort')
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
    ['https://www.youtube.com/shorts/<ID>', true],
    ['https://www.youtube.com/watch?v=<ID>', false],
    ['https://www.youtube.com/watch?v=<ID>&t=<TIMESTAMP>', false],
    ['https://youtu.be/<ID>', false],
    ['https://youtu.be/<ID>?t=<TIMESTAMP>', false],
  ])('can detect short urls it supports: (url: %s)', async (url: string, expected: boolean) => {
    expect(provider.hasClipSupport(url)).toEqual(expected)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockTwitchClip.url],
    [mockKickClip.clip_url],
  ])('throws an error for unknown short urls: (url: %s)', async (url: string) => {
    await expect(provider.getClip(url)).rejects.toThrow(
      `[YouTube Shorts]: Invalid short URL (${url}).`,
    )
  })

  it('caches clip data that it fetchs', async () => {
    const url = 'https://www.youtube.com/shorts/testshort'
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
  })

  it('can have the cached data cleared', async () => {
    const url = 'https://www.youtube.com/shorts/testshort'
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    provider.clearCache()
    expect(provider.hasCachedData).toEqual(false)
  })
})
