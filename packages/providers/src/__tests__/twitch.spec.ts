import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { TwitchUserCtx } from '@cq/services/twitch'

import { TwitchProvider } from '../twitch'
import { mockKickClip, mockTwitchClip, mockTwitchGame } from './mocks'

vi.mock('@cq/services/twitch', async (importOriginal) => {
  return {
    default: {
      ...(await importOriginal<typeof import('@cq/services/twitch')>()),
      getClips: vi.fn((_: TwitchUserCtx, ids: string[]) => {
        return ids.map((id) => ({ ...mockTwitchClip, id }))
      }),
      getGames: vi.fn((_: TwitchUserCtx, ids: string[]) => {
        return ids.map((id) => ({ ...mockTwitchGame, id }))
      }),
      getClipIdFromUrl: vi.fn((url: string) => {
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
      })
    }
  }
})

describe('twitch.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('knows if it is an experimental provider', () => {
    const provider = new TwitchProvider()
    expect(provider.isExperimental).toEqual(false)
  })

  it('gets the player format of the clip', () => {
    const provider = new TwitchProvider()
    expect(provider.getPlayerFormat()).toEqual('iframe')
  })

  it('gets the player source of the clip', async () => {
    const provider = new TwitchProvider()
    const clip = await provider.getClip(mockTwitchClip.url)
    expect(clip).toBeDefined()
    expect(provider.getPlayerSource(clip)).toEqual(
      `${mockTwitchClip.embed_url}&autoplay=true&parent=${window.location.hostname}`
    )
  })

  it('can get a clip from a twitch url', async () => {
    const provider = new TwitchProvider()
    const clip = await provider.getClip(mockTwitchClip.url)
    expect(clip).toBeDefined()
    expect(clip.id).toEqual(mockTwitchClip.id)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockKickClip.clip_url]
  ])('throws an error for unknown clip urls: (url: %s)', async (url: string) => {
    const provider = new TwitchProvider()
    expect(provider.getClip(url)).rejects.toThrowError()
  })

  it('caches clip data that it fetchs', async () => {
    const provider = new TwitchProvider()
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(mockTwitchClip.url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
  })

  it('can have the cached data cleared', async () => {
    const provider = new TwitchProvider()
    expect(provider.hasCachedData).toEqual(false)
    expect(await provider.getClip(mockTwitchClip.url)).toBeDefined()
    expect(provider.hasCachedData).toEqual(true)
    provider.clearCache()
    expect(provider.hasCachedData).toEqual(false)
  })
})
