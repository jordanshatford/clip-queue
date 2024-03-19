import { beforeEach, describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { mockKickClip } from '@/__tests__/mocks'
import { isClipUrl, getClipIdFromUrl, getClip } from '../kick'

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
