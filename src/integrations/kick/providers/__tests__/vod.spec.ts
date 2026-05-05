import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { KickVideo } from '../../core/types'

import {
  mockKickClip,
  mockKickVod,
  mockTwitchClip,
  mockTwitchVod,
} from '../../../core/__tests__/mocks'
import { KickVodProvider } from '../vod'

vi.mock('@/integrations/kick/core/api.ts', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/integrations/twitch/core/api')>()),
    getVideo: vi.fn<(uuid: string) => KickVideo>((uuid: string): KickVideo => {
      return { ...mockKickVod, uuid }
    }),
  }
})

const provider = new KickVodProvider()

describe('integrations/kick/providers/vod', () => {
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

  it('gets the player config of the vod', async () => {
    const url = `https://www.kick.com/channel/videos/${mockKickVod.uuid}`
    const video = await provider.getClip(url)
    expect(video).toBeDefined()
    expect(provider.getPlayerConfig(video)).toEqual({
      type: 'video',
      src: video.embedUrl,
      title: video.title,
      poster: video.thumbnailUrl,
      start: undefined,
    })
  })

  it('gets the player config of the vod with a timestamp', async () => {
    const url = `https://www.kick.com/channel/videos/${mockKickVod.uuid}?t=1000`
    const video = await provider.getClip(url)
    expect(video).toBeDefined()
    expect(provider.getPlayerConfig(video)).toEqual({
      type: 'video',
      src: video.embedUrl,
      title: video.title,
      poster: video.thumbnailUrl,
      start: 1000,
    })
  })

  it('can get a video from a kick url', async () => {
    const url = `https://www.kick.com/channel/videos/${mockKickVod.uuid}`
    const video = await provider.getClip(url)
    expect(video).toBeDefined()
    expect(video.id).toEqual(mockKickVod.uuid)
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
    [`https://www.kick.com/channel/videos/${mockKickVod.uuid}`, true],
    [`https://www.kick.com/channel/videos/${mockKickVod.uuid}?t=123`, true],
  ])('can detect clip urls it supports: (url: %s)', async (url: string, expected: boolean) => {
    expect(provider.hasClipSupport(url)).toEqual(expected)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockTwitchClip.url],
    [mockKickClip.clip_url],
  ])('throws an error for unknown video urls: (url: %s)', async (url: string) => {
    await expect(provider.getClip(url)).rejects.toThrow(`[Kick Videos]: Invalid VOD URL (${url}).`)
  })

  it('caches clip data that it fetchs', async () => {
    const url = `https://www.kick.com/channel/videos/${mockKickVod.uuid}`
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
  })

  it('can have the cached data cleared', async () => {
    const url = `https://www.kick.com/channel/videos/${mockKickVod.uuid}`
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    provider.clearCache()
    expect(provider.hasCachedData).toEqual(false)
  })
})
