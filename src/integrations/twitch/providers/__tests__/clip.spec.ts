import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { TwitchClip, TwitchGame } from '@/integrations/twitch'

import { clips as clipSource } from '@/integrations/twitch'

import { mockKickClip, mockTwitchClip, mockTwitchGame } from '../../../core/__tests__/mocks'

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

describe('integrations/twitch/providers/clip', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clipSource.clearCache()
  })

  it('knows if it is an experimental provider', () => {
    expect(clipSource.isExperimental).toEqual(false)
  })

  it('gets the player format of the clip', () => {
    expect(clipSource.getPlayerFormat()).toEqual('iframe')
  })

  it('gets the player source of the clip', async () => {
    const clip = await clipSource.getClip(mockTwitchClip.url)
    expect(clip).toBeDefined()
    expect(clipSource.getPlayerSource(clip)).toEqual(
      `${mockTwitchClip.embed_url}&autoplay=true&parent=${window.location.hostname}`,
    )
  })

  it('can get a clip from a twitch url', async () => {
    const clip = await clipSource.getClip(mockTwitchClip.url)
    expect(clip).toBeDefined()
    expect(clip.id).toEqual(mockTwitchClip.id)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockKickClip.clip_url],
  ])('throws an error for unknown clip urls: (url: %s)', async (url: string) => {
    await expect(clipSource.getClip(url)).rejects.toThrow(
      `[Twitch Clips]: Invalid clip URL (${url}).`,
    )
  })

  it('caches clip data that it fetchs', async () => {
    expect(clipSource.hasCachedData).toEqual(false)
    expect(await clipSource.getClip(mockTwitchClip.url)).toBeDefined()
    expect(clipSource.hasCachedData).toEqual(true)
  })

  it('can have the cached data cleared', async () => {
    expect(clipSource.hasCachedData).toEqual(false)
    expect(await clipSource.getClip(mockTwitchClip.url)).toBeDefined()
    expect(clipSource.hasCachedData).toEqual(true)
    clipSource.clearCache()
    expect(clipSource.hasCachedData).toEqual(false)
  })
})
