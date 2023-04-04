import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSearch } from '../search'
import type { SubredditPost } from '../../services/reddit'
import type { TwitchClip, TwitchGame, TwitchUserCtx } from '../../services/twitch'

vi.mock('@/services/twitch', () => {
  const mockFunction = vi.fn((_: TwitchUserCtx, ids: string[]) => {
    return ids.map((id) => {
      return {
        id,
        game_id: 'testgame',
        title: 'Test title',
        broadcaster_name: 'testbroadcast',
        created_at: '',
        thumbnail_url: '',
        url: 'https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j',
        embed_url: 'https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j'
      } as TwitchClip
    })
  })
  const mockFunction2 = vi.fn((_: TwitchUserCtx, ids: string[]) => {
    return ids.map((id) => {
      return { id, name: 'Test Game' } as TwitchGame
    })
  })
  return {
    default: {
      getClips: mockFunction,
      getGames: mockFunction2,
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

vi.mock('@/services/reddit', () => {
  const mockFunction = vi.fn((subreddit: string) => {
    if (subreddit === 'test') {
      const testPost: SubredditPost[] = [
        {
          data: {
            author: `${subreddit}1`,
            url: 'https://clips.twitch.tv/1',
            stickied: false
          }
        },
        {
          data: {
            author: `${subreddit}2`,
            url: 'https://clips.twitch.tv/2',
            stickied: false
          }
        }
      ]
      return testPost
    } else if (subreddit === 'noclips') {
      return []
    }
    throw Error('subreddit doesnt exist')
  })
  return {
    default: {
      getSubredditPosts: mockFunction
    }
  }
})

describe('search.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('is created in a none loading state', () => {
    const search = useSearch()
    expect(search.term).toEqual('')
    expect(search.loading).toEqual(false)
    expect(search.results).toEqual([])
  })

  it('can get clips from a subreddit based on search term', async () => {
    const search = useSearch()
    search.term = 'test'
    await search.getFromSubreddit()
    expect(search.results.length).toEqual(2)
    expect(search.loading).toEqual(false)
    for (let i = 0; i < search.results.length; i++) {
      const clip = search.results[i]
      expect(clip.id).toEqual(`${i + 1}`)
      expect(clip.submitter).toEqual(`test${i + 1}`)
    }
  })

  it('returns no results when the subreddit is not valid', async () => {
    const search = useSearch()
    search.term = 'doesntexist'
    await search.getFromSubreddit()
    expect(search.results.length).toEqual(0)
  })

  it('returns no results when the subreddit has no Twitch clips', async () => {
    const search = useSearch()
    search.term = 'noclips'
    await search.getFromSubreddit()
    expect(search.results.length).toEqual(0)
  })
})
