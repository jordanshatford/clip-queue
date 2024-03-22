import { beforeEach, describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { getClipIdFromUrl, getClip } from '..'
import type { KickClip, KickCategory, KickChannel } from '..'

export const mockKickCategory: KickCategory = {
  id: 123,
  name: 'testcategory',
  slug: 'testcategory',
  responsive: 'https://files.kick.com/images/subcategories/15/banner/testcategory',
  banner: 'https://files.kick.com/images/subcategories/15/banner/testcategory',
  parent_category: 'testparentcategory'
}

export const mockKickChannel: KickChannel = {
  id: 456,
  username: 'testchannel',
  slug: 'testchannel',
  profile_picture: null
}

export const mockKickClip: KickClip = {
  id: 'testclip',
  livestream_id: '12',
  category_id: '1',
  channel_id: 123,
  user_id: 456,
  title: 'testtitle',
  clip_url: 'https://kick.com/channel?clip=testclip',
  thumbnail_url: 'https://kick.com/thumbnail',
  privacy: 'CLIP_PRIVACY_PUBLIC',
  likes: 1,
  liked: false,
  views: 123,
  duration: 22,
  started_at: '2024-02-22T08:45:01.000Z',
  created_at: '2024-02-22T08:47:27.000Z',
  is_mature: false,
  video_url: 'https://kick.com/video',
  view_count: 123,
  likes_count: 1,
  category: mockKickCategory,
  creator: mockKickChannel,
  channel: mockKickChannel
}

vi.mock('axios', async () => {
  const mockGet = vi.fn().mockImplementation((url: string) => {
    return {
      data: {
        clip: {
          ...mockKickClip,
          clip_url: url
        }
      }
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
    const clip = await getClip('testclip')
    expect(clip?.id).toEqual('testclip')
    expect(clip?.title).toEqual('testtitle')
    expect(clip?.channel.username).toEqual('testchannel')
    expect(axios.create().get).toHaveBeenCalledTimes(1)
  })

  it('returns undefined if no clip is passed', async () => {
    expect(await getClip('')).toBeUndefined()
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL', undefined],
    [
      'https://kick.com/test?clip=clip_01HQ7ZWTEKKJP16Y34SDFF2SBC',
      'clip_01HQ7ZWTEKKJP16Y34SDFF2SBC'
    ],
    ['https://kick.com/test?clip=123', '123'],
    ['https://kick.com/test?somenonclipparam=123', undefined],
    ['', undefined]
  ])('gets an id from a clip url', (input: string, expected: string | undefined) => {
    expect(getClipIdFromUrl(input)).toEqual(expected)
  })
})
