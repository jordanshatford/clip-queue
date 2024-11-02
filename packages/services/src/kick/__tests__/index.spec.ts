import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getClip, getClipIdFromUrl } from '..'
import { mockKickClip } from '../../__tests__/mocks'

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
    [
      'https://kick.com/test/clips/clip_01JBKJJC162V3P5TBT8EAY6Z13',
      'clip_01JBKJJC162V3P5TBT8EAY6Z13'
    ],
    ['', undefined]
  ])('gets an id from a clip url', (input: string, expected: string | undefined) => {
    expect(getClipIdFromUrl(input)).toEqual(expected)
  })
})
