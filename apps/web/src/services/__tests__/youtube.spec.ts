import { beforeEach, describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { mockYouTubeClip } from '@/__tests__/mocks'
import { isClipUrl, getClipIdFromUrl, getClip } from '../youtube'

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

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL', false],
    ['', false],
    ['https://www.youtube.com/clip/1234', true],
    ['https://www.youtube.com/clip/test', true]
  ])('checks if link is a clip url', (input: string, expected: boolean) => {
    expect(isClipUrl(input)).toEqual(expected)
  })

  it.each([
    ['https://www.youtube.com/clip/01HQ7ZWTEKKJP16Y34SDFF2SBC', '01HQ7ZWTEKKJP16Y34SDFF2SBC'],
    ['https://www.youtube.com/clip/test', 'test'],
    ['', undefined]
  ])('gets an id from a clip url', (input: string, expected: string | undefined) => {
    expect(getClipIdFromUrl(input)).toEqual(expected)
  })
})
