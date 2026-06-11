import { describe, expect, it } from 'vitest'

import {
  parseEmbedURLFromHTML,
  isSupportedProviderURL,
  OEmbedProviderName,
} from '../../../shared/oembed'
import { mockOEmbed } from './mocks'

describe('shared/oembed/utils', () => {
  describe('parseEmbedURLFromHTML', () => {
    it('parses the embed url from the oembed details', () => {
      expect(parseEmbedURLFromHTML(mockOEmbed)).toEqual('https://test-src-iframe.com/')
    })
  })

  describe('isSupportedProviderURL', () => {
    it.each([
      [OEmbedProviderName.DAILYMOTION, 'https://google.ca', false],
      [OEmbedProviderName.DAILYMOTION, 'https://kick.com/', false],
      [OEmbedProviderName.DAILYMOTION, 'https://twitch.tv/', false],
      [OEmbedProviderName.DAILYMOTION, 'https://dailymotion.com/', true],
      [OEmbedProviderName.DAILYMOTION, 'https://www.dailymotion.com/', true],
      [OEmbedProviderName.DAILYMOTION, 'https://dai.ly/', true],
      [OEmbedProviderName.MEDAL, 'https://google.ca', false],
      [OEmbedProviderName.MEDAL, 'https://kick.com/', false],
      [OEmbedProviderName.MEDAL, 'https://twitch.tv/', false],
      [OEmbedProviderName.MEDAL, 'https://medal.tv/', true],
      [OEmbedProviderName.MEDAL, 'https://www.medal.tv/', true],
      [OEmbedProviderName.SOOP, 'https://google.ca', false],
      [OEmbedProviderName.SOOP, 'https://kick.com/', false],
      [OEmbedProviderName.SOOP, 'https://twitch.tv/', false],
      [OEmbedProviderName.SOOP, 'https://vod.sooplive.com/', true],
      [OEmbedProviderName.STREAMABLE, 'https://google.ca', false],
      [OEmbedProviderName.STREAMABLE, 'https://kick.com/', false],
      [OEmbedProviderName.STREAMABLE, 'https://twitch.tv/', false],
      [OEmbedProviderName.STREAMABLE, 'https://streamable.com/', true],
      [OEmbedProviderName.STREAMABLE, 'https://www.streamable.com/', true],
      [OEmbedProviderName.VIMEO, 'https://google.ca', false],
      [OEmbedProviderName.VIMEO, 'https://kick.com/', false],
      [OEmbedProviderName.VIMEO, 'https://twitch.tv/', false],
      [OEmbedProviderName.VIMEO, 'https://vimeo.com/', true],
      [OEmbedProviderName.VIMEO, 'https://www.vimeo.com/', true],
      [OEmbedProviderName.RUMBLE, 'https://google.ca', false],
      [OEmbedProviderName.RUMBLE, 'https://kick.com/', false],
      [OEmbedProviderName.RUMBLE, 'https://twitch.tv/', false],
      [OEmbedProviderName.RUMBLE, 'https://rumble.com/', true],
      [OEmbedProviderName.RUMBLE, 'https://www.rumble.com/', true],
      [OEmbedProviderName.YOUTUBE, 'https://google.ca', false],
      [OEmbedProviderName.YOUTUBE, 'https://kick.com/', false],
      [OEmbedProviderName.YOUTUBE, 'https://twitch.tv/', false],
      [OEmbedProviderName.YOUTUBE, 'https://youtube.com/shorts/id', true],
      [OEmbedProviderName.YOUTUBE, 'https://www.youtube.com/watch?v=id', true],
      [OEmbedProviderName.YOUTUBE, 'https://www.youtube.com/watch?v=id&t=123', true],
      [OEmbedProviderName.YOUTUBE, 'https://youtu.be/id', true],
      [OEmbedProviderName.YOUTUBE, 'https://youtu.be/id?t=456', true],
    ])(
      'isSupportedProviderURL(%s, %s) -> %s',
      (name: OEmbedProviderName, url: string, expected: boolean) => {
        expect(isSupportedProviderURL(name, new URL(url))).toBe(expected)
      },
    )
  })
})
