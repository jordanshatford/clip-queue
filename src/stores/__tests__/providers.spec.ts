import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Clip } from '@/integrations/core'
import type { KickClip } from '@/integrations/kick'
import type { TwitchClip, TwitchGame } from '@/integrations/twitch/core/types'

import { mockKickClip, mockTwitchClip, mockTwitchGame } from '@/__tests__/mocks'

import { useProviders } from '../providers'

vi.mock('@/integrations/kick/core/api', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/integrations/kick/core/api')>()),
    getClip: vi.fn<(id: string) => KickClip>((id: string) => ({ ...mockKickClip, id })),
  }
})

vi.mock('@/integrations/twitch/core/api', async (importOriginal) => {
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

vi.mock('@/integrations/twitch/core/utils', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/integrations/twitch/core/utils')>()),
    getClipIdFromUrl: vi.fn<(url: string) => string | undefined>((url: string) => {
      if (!url.includes('twitch')) {
        return
      }
      try {
        const uri = new URL(url)
        const segments = uri.pathname.split('/').filter(Boolean)
        const id = segments.pop()
        return id
      } catch {
        return
      }
    }),
  }
})

describe('providers.ts', () => {
  beforeEach(() => {
    localStorage?.clear()
    vi.clearAllMocks()
    setActivePinia(createPinia())
    const providers = useProviders()
    providers.purge()
  })

  it.each([
    [mockKickClip.clip_url, mockKickClip.id],
    [mockTwitchClip.url, mockTwitchClip.id],
  ])(
    'returns a clip ID for valid clip url: (url: %s) -> %s',
    async (input: string, expected: string) => {
      const providers = useProviders()
      const clip = await providers.getClip(input)
      expect(clip).toBeDefined()
      expect(clip?.id).toEqual(expected)
    },
  )

  it.each([
    ['', undefined],
    ['abc', undefined],
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL', undefined],
  ])(
    'returns undefined for invalid clip urls: (url: %s) -> %s',
    async (input: string, expected: Clip | undefined) => {
      const providers = useProviders()
      expect(await providers.getClip(input)).toEqual(expected)
    },
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
