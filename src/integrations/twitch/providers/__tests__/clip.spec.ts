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

vi.mock('@/integrations/twitch/core/utils.ts', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/integrations/twitch/core/utils')>()),
    getClipIdFromUrl: vi.fn<(url: string) => string | undefined>((url: string) => {
      if (!url.includes('twitch')) {
        return
      }
      try {
        const uri = new URL(url)
        const idStart = uri.pathname.lastIndexOf('/')
        return uri.pathname.slice(idStart).split('?')[0]?.slice(1)
      } catch {
        return
      }
    }),
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

  it('gets the player format of the clip', () => {
    expect(provider.getPlayerFormat()).toEqual('iframe')
  })

  it('gets the player source of the clip', async () => {
    const clip = await provider.getClip(mockTwitchClip.url)
    expect(clip).toBeDefined()
    expect(provider.getPlayerSource(clip)).toEqual(
      `${mockTwitchClip.embed_url}&autoplay=true&parent=${window.location.hostname}`,
    )
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
    [mockTwitchClip.url, true],
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
  })

  it('can have the cached data cleared', async () => {
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(mockTwitchClip.url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    provider.clearCache()
    expect(provider.hasCachedData).toEqual(false)
  })
})
