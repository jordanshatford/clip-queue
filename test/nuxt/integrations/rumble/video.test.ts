import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { OEmbedResponse } from '@/integrations/misc'

import { RumbleVideoProvider } from '~/integrations/rumble/providers/video'

import { mockKickClip, mockTwitchClip, mockTwitchVod, mockRumbleOEmbed } from '../../../mocks'

vi.mock('~/integrations/rumble/core/api.ts', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('~/integrations/rumble/core/api')>()),
    getRumbleOEmbed: vi.fn<(id: string) => OEmbedResponse>((id: string) => {
      return { ...mockRumbleOEmbed, version: id }
    }),
  }
})

const provider = new RumbleVideoProvider()

describe('integrations/rumble/providers/video', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    provider.clearCache()
  })

  it('knows if it is an experimental provider', () => {
    expect(provider.isExperimental).toEqual(false)
  })

  it('knows its initial enabled state', () => {
    expect(provider.isEnabled).toEqual(false)
  })

  it('can be enabled and disabled', () => {
    provider.isEnabled = true
    expect(provider.isEnabled).toEqual(true)
    provider.isEnabled = false
    expect(provider.isEnabled).toEqual(false)
    provider.isEnabled = true
    expect(provider.isEnabled).toEqual(true)
  })

  it('gets the player config of the video', async () => {
    const url = 'https://www.rumble.com/test-video.html'
    const clip = await provider.getClip(url)
    expect(clip).toBeDefined()
    expect(provider.getPlayerConfig(clip)).toEqual({
      type: 'iframe',
      src: `https://rumble.com/embed/url?autoplay=2`,
      title: clip.title,
    })
  })

  it('gets the player config of the video with a timestamp', async () => {
    const url = 'https://www.rumble.com/test-video.html?start=123'
    const clip = await provider.getClip(url)
    expect(clip).toBeDefined()
    expect(provider.getPlayerConfig(clip)).toEqual({
      type: 'iframe',
      src: `https://rumble.com/embed/url?autoplay=2&start=123`,
      title: clip.title,
    })
  })

  it('can get a video from a youtube url', async () => {
    const url = 'https://www.rumble.com/test-video.html?start=123'
    const video = await provider.getClip(url)
    expect(video).toBeDefined()
    expect(video.id).toEqual('test-video.html')
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
    ['https://www.youtube.com/shorts/<ID>', false],
    ['https://www.youtube.com/watch?v=<ID>', false],
    ['https://www.youtube.com/watch?v=<ID>&t=<TIMESTAMP>', false],
    ['https://youtu.be/<ID>', false],
    ['https://youtu.be/<ID>?t=<TIMESTAMP>', false],
    ['https://rumble.com/embed/<ID>/', true],
    ['https://rumble.com/embed/<ID>/?start=<TIMESTAMP>', true],
    ['https://rumble.com/<ID>-<NAME>.html', true],
    ['https://rumble.com/<ID>-<NAME>.html?start=<TIMESTAMP>', true],
  ])('can detect video urls it supports: (url: %s)', async (url: string, expected: boolean) => {
    expect(provider.hasClipSupport(url)).toEqual(expected)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockTwitchClip.url],
    [mockKickClip.clip_url],
  ])('throws an error for unknown video urls: (url: %s)', async (url: string) => {
    await expect(provider.getClip(url)).rejects.toThrow(
      `[Rumble Videos]: Invalid video URL (${url}).`,
    )
  })

  it('caches clip data that it fetchs', async () => {
    const url = 'https://www.rumble.com/test-video.html'
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    expect(await provider.getClip(url)).toBeDefined()
  })

  it('can have the cached data cleared', async () => {
    const url = 'https://www.rumble.com/test-video.html'
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    provider.clearCache()
    expect(provider.hasCachedData).toEqual(false)
  })
})
