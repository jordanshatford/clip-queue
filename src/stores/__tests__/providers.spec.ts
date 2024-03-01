import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
  clipFromKick,
  clipFromTwitch,
  mockKickClip,
  mockTwitchClip,
  mockTwitchGame
} from '@/__tests__/mocks'
import { ClipProvider, type Clip, type PlayerFormat } from '@/providers'
import type { TwitchUserCtx } from '@/services/twitch'
import { useProviders } from '../providers'

vi.mock('@/services/kick', async (importOriginal) => {
  return {
    default: {
      ...(await importOriginal<typeof import('@/services/kick')>()),
      getClip: vi.fn((id: string) => ({ ...mockKickClip, id }))
    }
  }
})

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

describe('providers.ts', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('inits when values are already in localstorage', async () => {
    localStorage.setItem(
      'providers-cache',
      JSON.stringify({
        providers: {
          [ClipProvider.KICK]: {
            name: ClipProvider.KICK,
            cache: {
              [mockKickClip.id]: mockKickClip
            }
          },
          [ClipProvider.TWITCH]: {
            name: ClipProvider.TWITCH,
            clipsCache: {
              [mockTwitchClip.id]: mockTwitchClip
            },
            gamesCache: {
              [mockTwitchGame.id]: mockTwitchGame
            }
          }
        },
        enabledProviders: [ClipProvider.KICK, ClipProvider.TWITCH]
      })
    )
    const providers = useProviders()
    const cachedClip = await providers.getClip(mockTwitchClip.url)
    expect(cachedClip).toBeDefined()
    expect(cachedClip?.title).toEqual(mockTwitchClip.title)
    expect(cachedClip?.category).toEqual(mockTwitchGame.name)
    localStorage.removeItem('providers-cache')
  })

  it.each([
    [mockKickClip.clip_url, mockKickClip.id],
    [mockTwitchClip.url, mockTwitchClip.id]
  ])('returns a clip for valid clip urls', async (input: string, expected: string) => {
    const providers = useProviders()
    const c = await providers.getClip(input)
    expect(c).toBeDefined()
    expect(c?.id).toEqual(expected)
  })

  it.each([
    ['', undefined],
    ['abc', undefined],
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL', undefined]
  ])(
    'returns undefined for invalid clip urls',
    async (input: string, expected: Clip | undefined) => {
      const providers = useProviders()
      expect(await providers.getClip(input)).toEqual(expected)
    }
  )

  it.each([
    [clipFromKick, 'video' as PlayerFormat],
    [clipFromTwitch, 'iframe' as PlayerFormat],
    [{} as Clip, undefined]
  ])(
    'returns the correct player format based on clip',
    async (input: Clip, expected: PlayerFormat | undefined) => {
      const providers = useProviders()
      expect(await providers.getPlayerFormat(input)).toEqual(expected)
    }
  )

  it.each([
    [clipFromKick, clipFromKick.embedUrl],
    [clipFromTwitch, `${clipFromTwitch.embedUrl}&autoplay=true&parent=${window.location.hostname}`],
    [{} as Clip, undefined]
  ])(
    'returns the correct player source based on clip',
    async (input: Clip, expected: string | undefined) => {
      const providers = useProviders()
      expect(await providers.getPlayerSource(input)).toEqual(expected)
    }
  )

  it('caches clip data that it fetchs', async () => {
    const providers = useProviders()
    expect(providers.hasCachedData).toEqual(false)
    expect(await providers.getClip(mockTwitchClip.url)).toBeDefined()
    expect(providers.hasCachedData).toEqual(true)
  })

  it('can have the cached data purged', async () => {
    const providers = useProviders()
    expect(providers.hasCachedData).toEqual(false)
    expect(await providers.getClip(mockTwitchClip.url)).toBeDefined()
    expect(providers.hasCachedData).toEqual(true)
    providers.purge()
    expect(providers.hasCachedData).toEqual(false)
    expect(await providers.getClip(mockKickClip.clip_url)).toBeDefined()
    expect(providers.hasCachedData).toEqual(true)
  })
})
