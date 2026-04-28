import { describe, expect, it } from 'vitest'

import type { Clip } from '../provider'

import { IntegrationID } from '../../indentify'
import {
  toStorageKey,
  toClipUUID,
  fromSubmitterUUID,
  getAllURLsFromText,
  toSubmitterUUID,
} from '../utils'
import { clipFromKick, clipFromTwitch } from './mocks'

describe('integrations/common/utils', () => {
  it.each([
    [IntegrationID.TWITCH, 'test', '__cqi_twitch_test'],
    [IntegrationID.KICK, 'test', '__cqi_kick_test'],
    [IntegrationID.TWITCH, 'test2', '__cqi_twitch_test2'],
    [IntegrationID.KICK, 'test2', '__cqi_kick_test2'],
  ])(
    'creates a unique storage key: (integration: %o) -> %s',
    (integration: IntegrationID, key: string, expected: string) => {
      expect(toStorageKey(integration, key)).toEqual(expected)
    },
  )

  it.each([
    [clipFromKick, 'kick-clips:testclipkick'],
    [clipFromTwitch, 'ttv-clips:testcliptwitch'],
  ])('creates a uuid for a given clip: (clip: %o) -> %s', (clip: Clip, expected: string) => {
    expect(toClipUUID(clip)).toEqual(expected)
  })

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
        'https://yet-another-example.com',
      ],
    ],
    [
      'Here are some URLs with duplicates: https://example.com http://another-example.com?v=2121314&dasdbasbd=123 , and https://example.com',
      ['https://example.com', 'http://another-example.com?v=2121314&dasdbasbd=123'],
    ],
  ])('gets all urls from text: (text: %s) -> %o', (text: string, urls: string[]) => {
    expect(getAllURLsFromText(text)).toEqual(urls)
  })

  it.each([
    [IntegrationID.UNKNOWN, 'testuser', 'unknown:testuser'],
    [IntegrationID.TWITCH, 'testuser', 'twitch:testuser'],
  ])(
    'converts a source and subitter to a uuid: (source: %s, submitter: %s) -> %s',
    (source: IntegrationID, submitter: string, expected: string) => {
      expect(toSubmitterUUID(source, submitter)).toEqual(expected)
    },
  )

  it.each([
    ['unknown:testuser', IntegrationID.UNKNOWN, 'testuser'],
    ['twitch:testuser', IntegrationID.TWITCH, 'testuser'],
    ['testuser', IntegrationID.UNKNOWN, 'testuser'],
    ['', IntegrationID.UNKNOWN, ''],
  ])(
    'converts a submitter uuid to a source and submitter: (uuid: %s) -> (%s, %s)',
    (uuid: string, expectedSource: IntegrationID, expectedSubmitter: string) => {
      expect(fromSubmitterUUID(uuid)).toEqual([expectedSource, expectedSubmitter])
    },
  )
})
