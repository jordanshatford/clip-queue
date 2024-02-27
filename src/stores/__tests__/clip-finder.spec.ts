import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ClipProvider, type Clip } from '../../interfaces/clips'
import type { TwitchClip, TwitchGame, TwitchUserCtx } from '../../services/twitch'
import type { SubredditPost } from '../../services/reddit'
import { useClipFinder } from '../clip-finder'
import type { KickClip } from '@/services/kick'

const testGame = { id: 'testgame', name: 'Test Game' } as TwitchGame

const testClip = {
  id: 'testclip',
  game_id: 'testgame',
  title: 'Test title',
  broadcaster_name: 'testbroadcast',
  created_at: '',
  thumbnail_url: '',
  url: 'https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j',
  embed_url: 'https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j'
} as TwitchClip

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
    const testPost: SubredditPost[] = [
      {
        data: {
          author: `${subreddit}0`,
          url: 'https://clips.twitch.tv/0',
          stickied: false
        }
      },
      {
        data: {
          author: `${subreddit}1`,
          url: 'https://clips.twitch.tv/1',
          stickied: true
        }
      }
    ]
    return testPost
  })
  return {
    default: {
      getSubredditPosts: mockFunction
    }
  }
})

vi.mock('@/services/kick', () => {
  const mockFunction = vi.fn((id: string) => {
    const clip: KickClip = {
      id,
      livestream_id: '12',
      category_id: '1',
      channel_id: 123,
      user_id: 456,
      title: 'Test title',
      clip_url: 'https://some.url',
      thumbnail_url: 'https://some.url',
      privacy: 'CLIP_PRIVACY_PUBLIC',
      likes: 1,
      liked: false,
      views: 123,
      duration: 22,
      started_at: '2024-02-22T08:45:01.796Z',
      created_at: '2024-02-22T08:47:27.015764Z',
      is_mature: true,
      video_url: 'https://some.url',
      view_count: 123,
      likes_count: 1,
      category: {
        id: 15,
        name: 'Just Chatting',
        slug: 'just-chatting',
        responsive:
          'https://files.kick.com/images/subcategories/15/banner/b697a8a3-62db-4779-aa76-e4e47662af97',
        banner:
          'https://files.kick.com/images/subcategories/15/banner/b697a8a3-62db-4779-aa76-e4e47662af97',
        parent_category: 'irl'
      },
      creator: {
        id: 123,
        username: 'test',
        slug: 'test',
        profile_picture: null
      },
      channel: {
        id: 456,
        username: 'testchannel',
        slug: 'testchannel',
        profile_picture: null
      }
    }
    return clip
  })
  return {
    default: {
      getClip: mockFunction,
      getClipIdFromUrl: vi.fn((url: string) => {
        if (!url.includes('kick')) {
          return undefined
        }
        try {
          const uri = new URL(url)
          return uri.searchParams.get('clip') ?? undefined
        } catch {
          return undefined
        }
      })
    }
  }
})

describe('clip-finder.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('inits when values are already in localstorage', async () => {
    localStorage.setItem(
      'twitch-cache',
      JSON.stringify({ games: { [testGame.id]: testGame }, clips: { [testClip.id]: testClip } })
    )
    const clipFinder = useClipFinder()
    const cachedClip = await clipFinder.getTwitchClip(testClip.url)
    expect(cachedClip?.title).toEqual(testClip.title)
    expect(cachedClip?.game).toEqual(testGame.name)
  })

  it.each([
    ['', undefined],
    ['abc', undefined],
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL', undefined]
  ])(
    'returns undefined for invalid input values',
    async (input: string, expected: Clip | undefined) => {
      const clipFinder = useClipFinder()
      expect(await clipFinder.getTwitchClip(input)).toEqual(expected)
    }
  )

  it('returns a clip for valid twitch links', async () => {
    const clipId = 'CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j'
    const clipLink = `https://clips.twitch.tv/${clipId}`
    const clipFinder = useClipFinder()
    const result = await clipFinder.getTwitchClip(clipLink)
    expect(result).toEqual({
      channel: 'testbroadcast',
      game: 'Test Game',
      id: clipId,
      timestamp: '',
      title: 'Test title',
      url: clipLink,
      embedUrl: 'https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j',
      thumbnailUrl: '',
      provider: ClipProvider.TWITCH
    })
  })

  it('returns clips from a subreddit', async () => {
    const clipFinder = useClipFinder()
    const result = await clipFinder.getClipsFromSubreddit('testReddit')
    expect(result).toHaveLength(1)
    expect(result[0].id).toEqual('0')
    expect(result[0].submitter).toEqual('testReddit0')
  })

  it('returns a clip for valid kick links', async () => {
    const clipId = 'clip_01HQ7ZWTEKKJP16Y34SDFF2SBC'
    const clipLink = `https://kick.com/test?clip=${clipId}`
    const clipFinder = useClipFinder()
    const result = await clipFinder.getKickClip(clipLink)
    expect(result).toEqual({
      channel: 'testchannel',
      game: 'Just Chatting',
      id: clipId,
      timestamp: '2024-02-22T08:47:27.015764Z',
      title: 'Test title',
      url: clipLink,
      embedUrl: 'https://some.url',
      thumbnailUrl: 'https://some.url',
      provider: ClipProvider.KICK
    })
  })
})
