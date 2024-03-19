import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mockKickClip, mockTwitchClip, mockTwitchGame } from '@/__tests__/mocks'
import type { TwitchUserCtx } from '@/services/twitch'
import { TwitchProvider } from '../twitch'

vi.mock('@/services/twitch', async (importOriginal) => {
  return {
    default: {
      ...(await importOriginal<typeof import('@/services/twitch')>()),
      getClips: vi.fn((_: TwitchUserCtx, ids: string[]) => {
        return ids.map((id) => ({ ...mockTwitchClip, id }))
      }),
      getGames: vi.fn((_: TwitchUserCtx, ids: string[]) => {
        return ids.map((id) => ({ ...mockTwitchGame, id }))
      }),
      getClipIdFromUrl: vi.fn((url: string) => {
        if (!url.includes('twitch')) {
          return undefined
        }
        try {
          const uri = new URL(url)
          const idStart = uri.pathname.lastIndexOf('/')
          return uri.pathname.slice(idStart).split('?')[0].slice(1)
        } catch {
          return undefined
        }
      })
    }
  }
})

describe('twitch.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('knows if it is an experimental provider', () => {
    const twitchProvider = new TwitchProvider()
    expect(twitchProvider.isExperimental).toEqual(false)
  })

  it('gets the player format of the clip', () => {
    const twitchProvider = new TwitchProvider()
    expect(twitchProvider.getPlayerFormat()).toEqual('iframe')
  })

  it('gets the player source of the clip', async () => {
    const twitchProvider = new TwitchProvider()
    const c = await twitchProvider.getClip(mockTwitchClip.url)
    expect(c).toBeDefined()
    if (c) {
      expect(twitchProvider.getPlayerSource(c)).toEqual(
        `${mockTwitchClip.embed_url}&autoplay=true&parent=${window.location.hostname}`
      )
    }
  })

  it('can get a clip from a twitch url', async () => {
    const twitchProvider = new TwitchProvider()
    const c = await twitchProvider.getClip(mockTwitchClip.url)
    expect(c).toBeDefined()
    expect(c?.id).toEqual(mockTwitchClip.id)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockKickClip.clip_url]
  ])('returns undefined for unknown clip urls', async (url: string) => {
    const twitchProvider = new TwitchProvider()
    expect(await twitchProvider.getClip(url)).toBeUndefined()
  })

  it('caches clip data that it fetchs', async () => {
    const twitchProvider = new TwitchProvider()
    expect(twitchProvider.hasCachedData).toEqual(false)
    expect(await twitchProvider.getClip(mockTwitchClip.url)).toBeDefined()
    expect(twitchProvider.hasCachedData).toEqual(true)
  })

  it('can have the cached data cleared', async () => {
    const twitchProvider = new TwitchProvider()
    expect(twitchProvider.hasCachedData).toEqual(false)
    expect(await twitchProvider.getClip(mockTwitchClip.url)).toBeDefined()
    expect(twitchProvider.hasCachedData).toEqual(true)
    twitchProvider.clearCache()
    expect(twitchProvider.hasCachedData).toEqual(false)
  })
})
