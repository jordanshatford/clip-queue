import { describe, expect, it } from 'vitest'

import { ClipSource } from '../types'
import { fromSubmitterUUID, getAllURLsFromText, toSubmitterUUID } from '../utils'

describe('utils.ts', () => {
  it.each([
    ['', []],
    ['https://example.com', ['https://example.com']],
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
  ])('gets all urls from text: (text: %s) -> %o', (text: string, urls: string[]) => {
    expect(getAllURLsFromText(text)).toEqual(urls)
  })

  it.each([
    [ClipSource.UNKNOWN, 'testuser', 'Unknown:testuser'],
    [ClipSource.TWITCH, 'testuser', 'Twitch:testuser']
  ])(
    'converts a source and subitter to a uuid: (source: %s, submitter: %s) -> %s',
    (source: ClipSource, submitter: string, expected: string) => {
      expect(toSubmitterUUID(source, submitter)).toEqual(expected)
    }
  )

  it.each([
    ['Unknown:testuser', ClipSource.UNKNOWN, 'testuser'],
    ['Twitch:testuser', ClipSource.TWITCH, 'testuser'],
    ['testuser', ClipSource.UNKNOWN, 'testuser'],
    ['', ClipSource.UNKNOWN, '']
  ])(
    'converts a submitter uuid to a source and submitter: (uuid: %s) -> (%s, %s)',
    (uuid: string, expectedSource: ClipSource, expectedSubmitter: string) => {
      expect(fromSubmitterUUID(uuid)).toEqual([expectedSource, expectedSubmitter])
    }
  )
})
