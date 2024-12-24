import { describe, expect, it } from 'vitest'

import { getAllURLsFromText, toSubmitterUUID } from '../utils'
import { ClipSource } from '../types'

describe('utils.ts', () => {
  it.each([
    ['', []],
    ['https://next.vue-test-utils.vuejs.org/', ['https://next.vue-test-utils.vuejs.org/']],
    ['Some test message with a url https://www.twitch.tv/', ['https://www.twitch.tv/']],
    ['Some test message with a url https://www.x.y/ then text after.', ['https://www.x.y/']],
    [
      'Here are some URLs: https://example.com http://another-example.com?v=2121314&dasdbasbd=123 , and https://yet-another-example.com',
      [
        'https://example.com',
        'http://another-example.com?v=2121314&dasdbasbd=123',
        'https://yet-another-example.com'
      ]
    ],
    [
      'Here are some URLs with duplicates: https://example.com http://another-example.com?v=2121314&dasdbasbd=123 , and https://example.com',
      ['https://example.com', 'http://another-example.com?v=2121314&dasdbasbd=123']
    ]
  ])('gets a url from a message when possible', (input: string, expected: string[]) => {
    expect(getAllURLsFromText(input)).toEqual(expected)
  })

  it.each([
    [ClipSource.APPLICATION, 'testuser', 'clip queue application:testuser'],
    [ClipSource.TWITCH_CHAT, 'testuser', 'twitch chat:testuser'],
  ])('returns a uuid for a given clip', (source: ClipSource, submitter: string, expected: string) => {
    expect(toSubmitterUUID(source, submitter)).toEqual(expected)
  })
})
