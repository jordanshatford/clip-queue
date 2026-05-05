import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { OEmbedResponse } from '../../core/types'

import {
  mockKickClip,
  mockKickVod,
  mockOEmbed,
  mockTwitchClip,
  mockTwitchVod,
} from '../../../core/__tests__/mocks'
import { SoopProvider } from '../soop'

vi.mock('@/integrations/misc/core/api.ts', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/integrations/misc/core/api')>()),
    getOEmbed: vi.fn<(url: string) => OEmbedResponse>((url: string): OEmbedResponse => {
      return { ...mockOEmbed, provider_url: url }
    }),
  }
})

const provider = new SoopProvider()

describe('integrations/misc/providers/soop', () => {
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
    const url = 'https://vod.sooplive.com/player/test'
    const video = await provider.getClip(url)
    expect(video).toBeDefined()
    expect(provider.getPlayerConfig(video)).toEqual({
      type: 'iframe',
      src: `${video.embedUrl}?autoPlay=true`,
      title: video.title,
    })
  })

  it('gets the player config of the video with a timestamp', async () => {
    const url = 'https://vod.sooplive.com/player/test?change_second=123'
    const video = await provider.getClip(url)
    expect(video).toBeDefined()
    expect(provider.getPlayerConfig(video)).toEqual({
      type: 'iframe',
      src: `${video.embedUrl}?autoPlay=true&change_second=123`,
      title: video.title,
    })
  })

  it('can get a video from a soop url', async () => {
    const url = 'https://vod.sooplive.com/player/test'
    const video = await provider.getClip(url)
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
    ['https://vod.sooplive.com/player/test', true],
    ['https://vod.sooplive.com/player/test?change_second=123', true],
  ])('can detect clip urls it supports: (url: %s)', async (url: string, expected: boolean) => {
    expect(provider.hasClipSupport(url)).toEqual(expected)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockTwitchClip.url],
    [mockKickClip.clip_url],
  ])('throws an error for unknown video urls: (url: %s)', async (url: string) => {
    await expect(provider.getClip(url)).rejects.toThrow(`[Soop]: Invalid video URL (${url}).`)
  })

  it('caches clip data that it fetchs', async () => {
    const url = 'https://vod.sooplive.com/player/test'
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
  })

  it('can have the cached data cleared', async () => {
    const url = 'https://vod.sooplive.com/player/test'
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    provider.clearCache()
    expect(provider.hasCachedData).toEqual(false)
  })
})
