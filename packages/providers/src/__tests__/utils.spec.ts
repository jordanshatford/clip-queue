import { describe, expect, it } from 'vitest'

import { Clip } from '@cq/providers'

import { toClipUUID } from '../utils'
import { clipFromKick, clipFromTwitch } from './mocks'

describe('utils.ts', () => {
  it.each([
    [clipFromKick, 'kick:testclipkick'],
    [clipFromTwitch, 'twitch:testcliptwitch']
  ])('returns a uuid for a given clip', (clip: Clip, expected: string) => {
    expect(toClipUUID(clip)).toEqual(expected)
  })
})
