import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockYouTubeClip, mockTwitchClip } from '@/__tests__/mocks'
import { YouTubeProvider } from '../youtube'

vi.mock('@cq/services/youtube', async (importOriginal) => {
  return {
    default: {
      ...(await importOriginal<typeof import('@cq/services/youtube')>()),
      getClip: vi.fn((id: string) => ({ ...mockYouTubeClip, id }))
    }
  }
})

describe('youtube.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('knows if it is an experimental provider', () => {
    const youTubeProvider = new YouTubeProvider()
    expect(youTubeProvider.isExperimental).toEqual(true)
  })

  it('gets the player format of the clip', () => {
    const youTubeProvider = new YouTubeProvider()
    expect(youTubeProvider.getPlayerFormat()).toEqual('iframe')
  })

  it('gets the player source of the clip', async () => {
    const youTubeProvider = new YouTubeProvider()
    const c = await youTubeProvider.getClip(mockYouTubeClip.url)
    expect(c).toBeDefined()
    if (c) {
      expect(youTubeProvider.getPlayerSource(c)).toContain(
        `https://www.youtube.com/embed/${mockYouTubeClip.video_id}?start=${mockYouTubeClip.start}&end=${mockYouTubeClip.end}`
      )
    }
  })

  it('can get a clip from a youtube clip url', async () => {
    const youTubeProvider = new YouTubeProvider()
    const c = await youTubeProvider.getClip(mockYouTubeClip.url)
    expect(c).toBeDefined()
    expect(c?.id).toEqual(mockYouTubeClip.id)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'],
    [''],
    [mockTwitchClip.url]
  ])('returns undefined for unknown clip urls', async (url: string) => {
    const youTubeProvider = new YouTubeProvider()
    expect(await youTubeProvider.getClip(url)).toBeUndefined()
  })

  it('caches clip data that it fetchs', async () => {
    const youTubeProvider = new YouTubeProvider()
    expect(youTubeProvider.hasCachedData).toEqual(false)
    expect(await youTubeProvider.getClip(mockYouTubeClip.url)).toBeDefined()
    expect(youTubeProvider.hasCachedData).toEqual(true)
  })

  it('can have the cached data cleared', async () => {
    const youTubeProvider = new YouTubeProvider()
    expect(youTubeProvider.hasCachedData).toEqual(false)
    expect(await youTubeProvider.getClip(mockYouTubeClip.url)).toBeDefined()
    expect(youTubeProvider.hasCachedData).toEqual(true)
    youTubeProvider.clearCache()
    expect(youTubeProvider.hasCachedData).toEqual(false)
  })
})
