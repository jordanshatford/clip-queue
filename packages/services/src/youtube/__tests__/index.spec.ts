import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getClip, getClipIdFromUrl } from '..'
import { mockYouTubeClip } from '../../__tests__/mocks'

vi.mock('axios', async () => {
  const mockGet = vi.fn().mockImplementation((url: string) => {
    if (url.includes('videos')) {
      return {
        data: {
          kind: 'kind',
          etag: 'etag',
          items: [
            {
              kind: 'kind',
              etag: 'etag',
              id: mockYouTubeClip.id,
              videoId: mockYouTubeClip.video_id,
              clip: {
                title: mockYouTubeClip.title,
                startTimeMs: mockYouTubeClip.start * 1000,
                endTimeMs: mockYouTubeClip.end * 1000
              }
            }
          ]
        }
      }
    } else if (url.includes('oembed')) {
      return {
        data: {
          title: 'testtitle',
          author_name: 'testauthor',
          author_url: '',
          type: '',
          height: 0,
          width: 0,
          version: '',
          provider_name: '',
          provider_url: '',
          thumbnail_height: 0,
          thumbnail_width: 0,
          thumbnail_url: 'https://www.youtube.com/thumbnail',
          html: ''
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

describe('youtube.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gets a youtube clip from youtube api', async () => {
    const clip = await getClip('testclip')
    expect(clip?.id).toEqual('testclip')
    expect(clip?.title).toEqual('testtitle')
    expect(clip?.author_name).toEqual('testauthor')
    expect(clip?.start).toEqual(0)
    expect(clip?.end).toEqual(100)
    expect(axios.create().get).toHaveBeenCalledTimes(2)
  })

  it('returns undefined if no clip is passed', async () => {
    expect(await getClip('')).toBeUndefined()
  })

  it.each([
    ['https://www.youtube.com/clip/01HQ7ZWTEKKJP16Y34SDFF2SBC', '01HQ7ZWTEKKJP16Y34SDFF2SBC'],
    ['https://www.youtube.com/clip/test', 'test'],
    ['', undefined],
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL', undefined],
    ['https://www.youtube.com/c/test', undefined]
  ])('gets an id from a clip url', (input: string, expected: string | undefined) => {
    expect(getClipIdFromUrl(input)).toEqual(expected)
  })
})
