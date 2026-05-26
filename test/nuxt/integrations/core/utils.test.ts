import { describe, expect, it } from 'vitest'
import { clipFromKick, clipFromTwitch } from '~~/test/mocks'

import type { Clip } from '~/integrations/core/provider'

import { IntegrationStatus } from '~/integrations/core'
import {
  toStorageKey,
  toClipUUID,
  fromSubmitterUUID,
  getAllURLsFromText,
  toSubmitterUUID,
  toColor,
  toIcon,
} from '~/integrations/core/utils'
import { IntegrationID } from '~/integrations/indentify'

describe('integrations/core/utils', () => {
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
      expect(fromSubmitterUUID(uuid)).toEqual({
        source: expectedSource,
        submitter: expectedSubmitter,
      })
    },
  )

  it.each([
    [IntegrationStatus.DISABLED, 'neutral'],
    [IntegrationStatus.MISCONFIGURED, 'error'],
    [IntegrationStatus.ERROR, 'error'],
    [IntegrationStatus.UNKNOWN, 'warning'],
    [IntegrationStatus.HEALTHY, 'success'],
  ])(
    'converts an integrations status to a color: (status: %s) -> %s',
    (status: IntegrationStatus, expected: string) => {
      expect(toColor(status)).toEqual(expected)
    },
  )

  it.each([
    [IntegrationStatus.DISABLED, 'lucide:circle-stop'],
    [IntegrationStatus.MISCONFIGURED, 'lucide:circle-alert'],
    [IntegrationStatus.ERROR, 'lucide:circle-alert'],
    [IntegrationStatus.UNKNOWN, 'lucide:triangle-alert'],
    [IntegrationStatus.HEALTHY, 'lucide:circle-check'],
  ])(
    'converts an integrations status to an icon: (status: %s) -> %s',
    (status: IntegrationStatus, expected: string) => {
      expect(toIcon(status)).toEqual(expected)
    },
  )
})
