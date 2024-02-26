import { beforeEach, describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { isClipUrl, getClipIdFromUrl, getClip, type KickClip } from '../kick'

function mockKickResponse(url: string) {
  const clip: KickClip = {
    id: 'testid',
    livestream_id: '12',
    category_id: '1',
    channel_id: 123,
    user_id: 456,
    title: 'Test title',
    clip_url: url,
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
  return {
    clip: clip
  }
}

vi.mock('axios', async () => {
  const mockGet = vi.fn().mockImplementation((url: string) => {
    return {
      data: mockKickResponse(url)
    }
  })
  return {
    default: {
      create: vi.fn(() => {
        return {
          get: mockGet
        }
      })
    }
  }
})

describe('kick.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gets a kick clip from kick api', async () => {
    const clip = await getClip('testid')
    expect(clip?.id).toEqual('testid')
    expect(clip?.title).toEqual('Test title')
    expect(clip?.channel.username).toEqual('testchannel')
    expect(axios.create().get).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL', false],
    ['', false],
    ['https://kick.com/test?clip=clip_01HQ7ZWTEKKJP16Y34SDFF2SBC', true],
    ['https://kick.com/test?clip=1234', true]
  ])('checks if link is a clip url', (input: string, expected: boolean) => {
    expect(isClipUrl(input)).toEqual(expected)
  })

  it.each([
    [
      'https://kick.com/test?clip=clip_01HQ7ZWTEKKJP16Y34SDFF2SBC',
      'clip_01HQ7ZWTEKKJP16Y34SDFF2SBC'
    ],
    ['https://kick.com/test?clip=123', '123'],
    ['', undefined]
  ])('gets an id from a clip url', (input: string, expected: string | undefined) => {
    expect(getClipIdFromUrl(input)).toEqual(expected)
  })
})
