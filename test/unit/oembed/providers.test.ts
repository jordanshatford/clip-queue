import { describe, expect, it } from 'vitest'

import { resolveOEmbedProvider } from '../../../shared/oembed'

describe('OEmbed Providers', () => {
  it.each([
    ['https://www.dailymotion.com/video/test', 'Dailymotion'],
    ['https://dailymotion.com/video/test', 'Dailymotion'],
    ['https://dai.ly/video/test', 'Dailymotion'],
    ['https://www.medal.tv/games/game/clips/test', 'Medal'],
    ['https://medal.tv/games/game/clips/test', 'Medal'],
    ['https://vod.sooplive.com/player/123', 'Soop'],
    ['https://www.streamable.com/test', 'Streamable'],
    ['https://streamable.com/test', 'Streamable'],
    ['https://www.vimeo.com/12345', 'Vimeo'],
    ['https://vimeo.com/12345', 'Vimeo'],
    ['https://www.rumble.com/v12345-test.html', 'Rumble'],
    ['https://rumble.com/v12345-test.html', 'Rumble'],
    ['https://www.youtube.com/watch?v=test', 'YouTube'],
    ['https://youtube.com/watch?v=test', 'YouTube'],
    ['https://youtu.be/watch?v=test', 'YouTube'],
  ])('resolves provider %s', (url, expected) => {
    expect(resolveOEmbedProvider(url).name).toBe(expected)
  })

  it.each([[''], ['abc'], ['https://twitch.tv/test'], ['https://kick.com/test']])(
    'throws for unsupported url %s',
    (url) => {
      expect(() => resolveOEmbedProvider(url)).toThrow(`No OEmbed provider supports URL: ${url}.`)
    },
  )
})
