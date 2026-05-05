import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { OEmbedResponse } from '../../core/types'

import {
  mockKickClip,
  mockKickVod,
  mockOEmbed,
  mockTwitchClip,
  mockTwitchVod,
} from '../../../core/__tests__/mocks'
import { VimeoProvider } from '../vimeo'

vi.mock('@/integrations/misc/core/api.ts', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/integrations/misc/core/api')>()),
    getOEmbed: vi.fn<(url: string) => OEmbedResponse>((url: string): OEmbedResponse => {
      return { ...mockOEmbed, provider_url: url }
    }),
  }
})

const provider = new VimeoProvider()

describe('integrations/misc/providers/vimeo', () => {
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
    const url = 'https://vimeo.com/test'
    const video = await provider.getClip(url)
    expect(video).toBeDefined()
    expect(provider.getPlayerConfig(video)).toEqual({
      type: 'iframe',
      src: `${video.embedUrl}#autoplay=true`,
      title: video.title,
    })
  })

  it('gets the player config of the video with a timestamp', async () => {
    const url = 'https://vimeo.com/test#t=1m21s'
    const video = await provider.getClip(url)
    expect(video).toBeDefined()
    expect(provider.getPlayerConfig(video)).toEqual({
      type: 'iframe',
      src: `${video.embedUrl}#autoplay=true&t=1m21s`,
      title: video.title,
    })
  })

  it('gets the player config of the video with a timestamp and end', async () => {
    const url = 'https://vimeo.com/test#t=1m21s&end=2m0s'
    const video = await provider.getClip(url)
    expect(video).toBeDefined()
    expect(provider.getPlayerConfig(video)).toEqual({
      type: 'iframe',
      src: `${video.embedUrl}#autoplay=true&t=1m21s&end=2m0s`,
      title: video.title,
    })
  })

  it('can get a video from a vimeo url', async () => {
    const url = 'https://vimeo.com/test'
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
    ['https://vimeo.com/test', true],
    ['https://vimeo.com/test#t=1m21s', true],
    ['https://vimeo.com/test#t=1m0s&end=2m1s', true],
  ])('can detect clip urls it supports: (url: %s)', async (url: string, expected: boolean) => {
    expect(provider.hasClipSupport(url)).toEqual(expected)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockTwitchClip.url],
    [mockKickClip.clip_url],
  ])('throws an error for unknown video urls: (url: %s)', async (url: string) => {
    await expect(provider.getClip(url)).rejects.toThrow(`[Vimeo]: Invalid video URL (${url}).`)
  })

  it('caches clip data that it fetchs', async () => {
    const url = 'https://vimeo.com/test'
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
  })

  it('can have the cached data cleared', async () => {
    const url = 'https://vimeo.com/test'
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    provider.clearCache()
    expect(provider.hasCachedData).toEqual(false)
  })
})
