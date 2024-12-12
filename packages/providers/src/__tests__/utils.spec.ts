import { describe, expect, it } from 'vitest'

import { Clip } from '@cq/providers'

import { toClipUUID } from '../utils'
import { clipFromKick, clipFromTwitch, clipFromYouTube } from './mocks'

describe('utils.ts', () => {
  it.each([
    [clipFromKick, 'kick:testclipkick'],
    [clipFromTwitch, 'twitch:testcliptwitch'],
    [clipFromYouTube, 'youtube:testclipyoutube']
  ])('returns a uuid for a given clip', async (clip: Clip, expected: string) => {
    expect(toClipUUID(clip)).toEqual(expected)
  })
})
